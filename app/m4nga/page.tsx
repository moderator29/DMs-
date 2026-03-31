'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Loader2,
  ShieldCheck, Info, Sparkles, BookOpen, Users, Lock,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/shared/ParticleField';

// ─── CONTRACT ─────────────────────────────────────────────────────────────────
const SBT_ADDRESS = '0x4e6eb6Ea74943a5d29C539974F518827C06eAcdE';
const MAINNET_ID  = '0x1';

// Public-mint SBT ABI — no whitelist, no token cost, anyone can mint
const SBT_ABI = [
  'function mint() external',
  'function mint(address to) external',
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function hasMinted(address addr) view returns (bool)',
];

// ─── RELEASES ─────────────────────────────────────────────────────────────────
const RELEASES = [
  {
    id: 1,
    name: 'Genesis SBT',
    edition: 'Edition #001',
    description:
      'The original Naka Go Soulbound Token. A permanent on-chain mark of being among the founding cult members. Non-transferable, non-sellable — permanently yours.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#FF4D00',
    tag: 'Open Mint',
    live: true,
  },
  {
    id: 2,
    name: 'Ddergo Records Pass',
    edition: 'Edition #002',
    description:
      'For the cultured ear. Holders of this SBT carry eternal recognition as supporters of the Ddergo sound. Vibe credentials permanently on-chain.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#1DB954',
    tag: 'Coming Soon',
    live: false,
  },
  {
    id: 3,
    name: 'Lore Keeper Seal',
    edition: 'Edition #003',
    description:
      'Granted to those who carry the story. The Lore Keeper SBT is for scholars of Naka Go history — those who read, study, and spread the lore.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#FFD700',
    tag: 'Coming Soon',
    live: false,
  },
] as const;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type WalletState = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';
type MintStep    = 'idle' | 'minting' | 'success' | 'error';

interface WalletInfo { address: string; chainId: string; }
interface MintInfo   { alreadyMinted: boolean; totalMinted: number | null; }

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function shortAddr(addr: string) { return `${addr.slice(0, 6)}…${addr.slice(-4)}`; }

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function M4ngaPage() {
  const [walletState, setWalletState] = useState<WalletState>('disconnected');
  const [wallet, setWallet]           = useState<WalletInfo | null>(null);
  const [mintInfo, setMintInfo]       = useState<MintInfo | null>(null);
  const [mintStep, setMintStep]       = useState<MintStep>('idle');
  const [txHash, setTxHash]           = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEip1193 = () => window.ethereum as any;
  const getEthers  = async () => import('ethers');

  const getProvider = async () => {
    const { BrowserProvider } = await getEthers();
    if (!window.ethereum) throw new Error('MetaMask not installed.');
    return new BrowserProvider(getEip1193());
  };

  const checkNetwork = async () => {
    const chainId = await getEip1193().request({ method: 'eth_chainId' }) as string;
    return chainId === MAINNET_ID;
  };

  const switchToMainnet = async () => {
    try {
      await getEip1193().request({ method: 'wallet_switchEthereumChain', params: [{ chainId: MAINNET_ID }] });
    } catch { setErrorMsg('Switch to Ethereum Mainnet in your wallet.'); }
  };

  // ── Load mint info ─────────────────────────────────────────────────────────
  const loadMintInfo = useCallback(async (addr: string) => {
    setLoadingInfo(true);
    try {
      const { Contract } = await getEthers();
      const provider = await getProvider();
      const sbt = new Contract(SBT_ADDRESS, SBT_ABI, provider);

      let alreadyMinted = false;
      try {
        const bal = await sbt.balanceOf(addr) as bigint;
        alreadyMinted = bal > 0n;
      } catch { /* ignore */ }
      try {
        alreadyMinted = await sbt.hasMinted(addr) as boolean;
      } catch { /* optional function */ }

      let totalMinted: number | null = null;
      try {
        const ts = await sbt.totalSupply() as bigint;
        totalMinted = Number(ts);
      } catch { /* ignore */ }

      setMintInfo({ alreadyMinted, totalMinted });
    } catch (e) {
      console.error('loadMintInfo:', e);
    } finally {
      setLoadingInfo(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Connect wallet ─────────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
        return;
      }
      setErrorMsg('Please install the MetaMask browser extension.');
      return;
    }
    setWalletState('connecting');
    setErrorMsg('');
    try {
      const provider = await getProvider();
      const accounts = await provider.send('eth_requestAccounts', []);
      const address: string = accounts[0];
      const onMainnet = await checkNetwork();
      if (!onMainnet) { setWalletState('wrong-network'); setWallet({ address, chainId: 'wrong' }); return; }
      const network = await provider.getNetwork();
      setWallet({ address, chainId: String(network.chainId) });
      setWalletState('connected');
      await loadMintInfo(address);
    } catch (e: unknown) {
      setWalletState('disconnected');
      const err = e as { code?: number; message?: string };
      setErrorMsg(err.code === 4001 ? 'Connection cancelled.' : (err.message ?? 'Connection failed.'));
    }
  };

  // ── Account / chain listeners ──────────────────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = getEip1193() as any;
    const onAccounts = (accounts: string[]) => {
      if (!accounts.length) { setWalletState('disconnected'); setWallet(null); setMintInfo(null); }
      else if (walletState === 'connected') loadMintInfo(accounts[0]);
    };
    const onChain = () => window.location.reload();
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => { eth.removeListener('accountsChanged', onAccounts); eth.removeListener('chainChanged', onChain); };
  }, [walletState, loadMintInfo]);

  // ── Mint ───────────────────────────────────────────────────────────────────
  const handleMint = async () => {
    if (!wallet) return;
    setErrorMsg('');
    setMintStep('minting');
    try {
      const { Contract } = await getEthers();
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const sbt = new Contract(SBT_ADDRESS, SBT_ABI, signer);

      // Try mint() first, fallback to mint(address)
      let tx;
      try {
        tx = await sbt['mint()']();
      } catch {
        tx = await sbt['mint(address)'](wallet.address);
      }
      const receipt = await tx.wait();
      setTxHash(receipt.hash as string);
      setMintStep('success');
      await loadMintInfo(wallet.address);
    } catch (e: unknown) {
      const err = e as { code?: number | string; reason?: string; message?: string };
      setMintStep('error');
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setErrorMsg('Transaction rejected. Please confirm in MetaMask.');
      } else if (err.reason) {
        setErrorMsg(`Contract error: ${err.reason}`);
      } else if (err.message?.includes('insufficient funds')) {
        setErrorMsg('Insufficient ETH for gas. Please add ETH to your wallet.');
      } else {
        setErrorMsg(err.message ?? 'Mint failed. Please try again.');
      }
    }
  };

  const canMint = walletState === 'connected' && !loadingInfo && !mintInfo?.alreadyMinted && mintStep !== 'minting';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <ParticleField density={40} color="#FF4D00" />
        <Header />

        <div className="relative z-10 container mx-auto px-4 py-28 max-w-4xl">

          {/* Back */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Home
            </motion.div>
          </Link>

          {/* ── HERO ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="mb-5 flex justify-center">
              <div className="p-4 rounded-full" style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.2)' }}>
                <ShieldCheck className="w-14 h-14 text-[#FF4D00]" style={{ filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.5))' }} />
              </div>
            </motion.div>
            <span className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.3em] mb-3 block" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              Naka Go Soulbound Tokens
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-none mb-4" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>
              <span style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>M4NGA</span> SBT
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed mb-4">
              Soulbound Tokens are non-transferable NFTs permanently tied to your wallet. They cannot be sold, traded, or transferred — only earned by being part of the cult.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-white/30 text-xs font-mono">Contract:</span>
              <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                className="text-[#FF4D00] text-xs font-mono hover:underline flex items-center gap-1">
                {shortAddr(SBT_ADDRESS)} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          {/* ── EXPLAINER STRIP ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { Icon: ShieldCheck, label: 'Non-Transferable', desc: 'Permanently tied to your wallet', color: '#FF4D00' },
              { Icon: Lock, label: 'One Per Wallet', desc: 'Each wallet can only mint once', color: '#FFD700' },
              { Icon: Users, label: 'Open Mint', desc: 'Anyone can mint — no whitelist', color: '#00FF88' },
              { Icon: BookOpen, label: 'On-Chain Forever', desc: 'Permanently recorded on Ethereum', color: '#00BFFF' },
            ].map(({ Icon, label, desc, color }) => (
              <div key={label} className="rounded-2xl p-4 text-center" style={{ background: '#111', border: `1px solid ${color}22` }}>
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                <p className="text-white text-xs font-bold mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>{label}</p>
                <p className="text-white/30 text-[10px] leading-snug">{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* ── WALLET CONNECT BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: walletState === 'connected' ? '#00FF88' : walletState === 'connecting' ? '#FFD700' : '#666' }} />
              <span className="text-white text-sm font-bold">
                {walletState === 'connected' && wallet ? shortAddr(wallet.address) : walletState === 'connecting' ? 'Connecting...' : walletState === 'wrong-network' ? 'Wrong Network' : 'Wallet not connected'}
              </span>
              {mintInfo?.totalMinted != null && (
                <span className="text-white/30 text-xs">· {mintInfo.totalMinted} minted total</span>
              )}
            </div>
            {walletState === 'disconnected' && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={connectWallet}
                className="px-6 py-2.5 rounded-full text-black text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
                Connect Wallet
              </motion.button>
            )}
            {walletState === 'connecting' && (
              <div className="flex items-center gap-2 text-white/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</div>
            )}
            {walletState === 'wrong-network' && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={switchToMainnet}
                className="px-6 py-2.5 rounded-full text-white text-sm font-black"
                style={{ background: '#FF4D00', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
                Switch to Mainnet
              </motion.button>
            )}
            {walletState === 'connected' && (
              <span className="text-[#00FF88] text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
            )}
          </motion.div>

          {/* Error message */}
          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.3)', color: '#FF6B6B' }}>
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> {errorMsg}
            </motion.div>
          )}

          {/* ── RELEASES LIST ── */}
          <div className="space-y-6">
            {RELEASES.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-3xl overflow-hidden"
                style={{ background: '#0f0f0f', border: `1px solid ${release.accent}22`, boxShadow: `0 0 40px ${release.accent}08` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(135deg, ${release.accent}15, #0a0a1a)` }}>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={release.image}
                        alt={release.name}
                        className="w-32 h-32 rounded-full object-cover"
                        style={{ border: `3px solid ${release.accent}80`, filter: `drop-shadow(0 0 20px ${release.accent}60)` }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </motion.div>
                    {/* Glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${release.accent}12 0%, transparent 70%)` }} />
                    {/* Edition badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
                      style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${release.accent}50`, color: release.accent, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                      {release.edition}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>{release.name}</h2>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                          style={{ background: release.live ? `${release.accent}22` : 'rgba(255,255,255,0.05)', color: release.live ? release.accent : '#666', border: `1px solid ${release.live ? release.accent + '44' : 'rgba(255,255,255,0.08)'}` }}>
                          {release.tag}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">{release.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {/* Mint status */}
                      {release.live && mintInfo?.alreadyMinted && (
                        <div className="flex items-center gap-2 text-[#00FF88] text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Already minted!</span>
                          {txHash && (
                            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                              className="text-white/30 hover:text-white transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      )}

                      {release.live && mintStep === 'success' && !mintInfo?.alreadyMinted && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 text-[#00FF88] text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Minted! It&apos;s yours forever.</span>
                          {txHash && (
                            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                              className="text-white/30 hover:text-white transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </motion.div>
                      )}

                      {/* Mint button */}
                      {release.live && !mintInfo?.alreadyMinted && mintStep !== 'success' && (
                        <motion.button
                          whileHover={canMint ? { scale: 1.04 } : {}}
                          whileTap={canMint ? { scale: 0.97 } : {}}
                          onClick={canMint ? handleMint : undefined}
                          disabled={!canMint}
                          className="px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 transition-all"
                          style={{
                            background: canMint
                              ? `linear-gradient(135deg, ${release.accent}, ${release.accent}CC)`
                              : 'rgba(255,255,255,0.06)',
                            color: canMint ? '#000' : '#555',
                            fontFamily: 'Bebas Neue, Impact, sans-serif',
                            letterSpacing: '0.12em',
                            cursor: canMint ? 'pointer' : 'not-allowed',
                            boxShadow: canMint ? `0 0 20px ${release.accent}40` : 'none',
                          }}
                        >
                          {mintStep === 'minting' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Minting…</>
                          ) : loadingInfo ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                          ) : walletState !== 'connected' ? (
                            'Connect to Mint'
                          ) : (
                            <><Sparkles className="w-4 h-4" /> Mint Free</>
                          )}
                        </motion.button>
                      )}

                      {/* Coming soon */}
                      {!release.live && (
                        <div className="px-6 py-3 rounded-full text-sm font-black text-white/20"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.12em' }}>
                          Coming Soon
                        </div>
                      )}

                      {/* Etherscan link */}
                      <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                        className="text-white/20 hover:text-white/50 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── INFO FOOTER ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-12 rounded-2xl p-5 text-center"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Info className="w-4 h-4 text-white/20 mx-auto mb-2" />
            <p className="text-white/25 text-xs leading-relaxed max-w-md mx-auto">
              Naka Go SBTs are fully on-chain, permanently non-transferable ERC-721 tokens.
              Minting only requires ETH for gas. Verify the contract on{' '}
              <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                className="text-[#FF4D00] hover:underline">Etherscan</a>.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
