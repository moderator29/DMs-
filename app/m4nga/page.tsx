'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, AlertCircle, CheckCircle2, Loader2, Wallet, ShieldCheck, ShieldX, Info } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SBT_ADDRESS   = '0x9AA41B74F3D87c3A27D49736692e70F175eFD420';
const NAKA_ADDRESS  = '0x6967b9a8c0b14849CFE8f9E5732B401433fD2898';
const MINT_COST     = BigInt('227000000000000000000'); // 227 NAKA (18 decimals)
const MAINNET_ID    = '0x1';

// Minimal ABIs (derived from contract structure — verified on Etherscan)
const SBT_ABI = [
  'function mint(address to) returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function isWhitelisted(address addr) view returns (bool)',
  'function hasMinted(address addr) view returns (bool)',
  'function totalSupply() view returns (uint256)',
];

const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type WalletState = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';
type MintStep    = 'idle' | 'checking' | 'approving' | 'minting' | 'success' | 'error';

interface WalletInfo {
  address: string;
  chainId: string;
}

interface EligibilityInfo {
  isWhitelisted: boolean | null;    // null = function doesn't exist on contract
  alreadyMinted: boolean;
  nakaBalance: bigint;
  allowance: bigint;
  hasEnough: boolean;
  totalMinted: number | null;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function fmtNaka(raw: bigint): string {
  const n = Number(raw) / 1e18;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(2);
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function M4ngaPage() {
  const [walletState, setWalletState]     = useState<WalletState>('disconnected');
  const [wallet, setWallet]               = useState<WalletInfo | null>(null);
  const [eligibility, setEligibility]     = useState<EligibilityInfo | null>(null);
  const [mintStep, setMintStep]           = useState<MintStep>('idle');
  const [txHash, setTxHash]               = useState('');
  const [errorMsg, setErrorMsg]           = useState('');
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  // ── Dynamic ethers.js import ────────────────────────────────────────────────
  const getEthers = async () => {
    const ethers = await import('ethers');
    return ethers;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEip1193 = () => window.ethereum as any;

  const getProvider = async () => {
    const { BrowserProvider } = await getEthers();
    if (!window.ethereum) throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    return new BrowserProvider(getEip1193());
  };

  // ── Network check ───────────────────────────────────────────────────────────
  const checkNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;
    const chainId = await getEip1193().request({ method: 'eth_chainId' }) as string;
    return chainId === MAINNET_ID;
  };

  const switchToMainnet = async () => {
    if (!window.ethereum) return;
    try {
      await getEip1193().request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MAINNET_ID }],
      });
    } catch {
      setErrorMsg('Please switch to Ethereum Mainnet in your wallet.');
    }
  };

  // ── Check eligibility ────────────────────────────────────────────────────────
  const checkEligibility = useCallback(async (addr: string) => {
    setLoadingEligibility(true);
    try {
      const { Contract } = await getEthers();
      const provider = await getProvider();

      const sbt   = new Contract(SBT_ADDRESS, SBT_ABI, provider);
      const naka  = new Contract(NAKA_ADDRESS, ERC20_ABI, provider);

      // NAKA balance + allowance
      const [nakaBalance, allowance] = await Promise.all([
        naka.balanceOf(addr) as Promise<bigint>,
        naka.allowance(addr, SBT_ADDRESS) as Promise<bigint>,
      ]);

      // Already minted? (balanceOf > 0 OR hasMinted if available)
      let alreadyMinted = false;
      try {
        const bal = await sbt.balanceOf(addr) as bigint;
        alreadyMinted = bal > 0n;
      } catch { /* ignore */ }

      // Try hasMinted function
      try {
        alreadyMinted = await sbt.hasMinted(addr) as boolean;
      } catch { /* function may not exist */ }

      // Whitelist check
      let isWhitelisted: boolean | null = null;
      try {
        isWhitelisted = await sbt.isWhitelisted(addr) as boolean;
      } catch { /* no whitelist function */ }

      // Total minted
      let totalMinted: number | null = null;
      try {
        const ts = await sbt.totalSupply() as bigint;
        totalMinted = Number(ts);
      } catch { /* ignore */ }

      setEligibility({
        isWhitelisted,
        alreadyMinted,
        nakaBalance,
        allowance,
        hasEnough: nakaBalance >= MINT_COST,
        totalMinted,
      });
    } catch (e) {
      console.error('Eligibility check failed:', e);
    } finally {
      setLoadingEligibility(false);
    }
  }, []);

  // ── Connect wallet ───────────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMsg('MetaMask not detected. Please install MetaMask first.');
      return;
    }
    setWalletState('connecting');
    setErrorMsg('');
    try {
      const provider = await getProvider();
      const accounts = await provider.send('eth_requestAccounts', []);
      const address: string = accounts[0];
      const onMainnet = await checkNetwork();

      if (!onMainnet) {
        setWalletState('wrong-network');
        setWallet({ address, chainId: 'wrong' });
        return;
      }

      const network = await provider.getNetwork();
      setWallet({ address, chainId: String(network.chainId) });
      setWalletState('connected');
      await checkEligibility(address);
    } catch (e: unknown) {
      setWalletState('disconnected');
      const err = e as { code?: number; message?: string };
      if (err.code === 4001) {
        setErrorMsg('Connection cancelled. Please approve in MetaMask.');
      } else {
        setErrorMsg(err.message ?? 'Connection failed.');
      }
    }
  };

  // ── Listen for account/chain changes ─────────────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = getEip1193() as any;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) {
        setWalletState('disconnected');
        setWallet(null);
        setEligibility(null);
      } else {
        setWallet((prev) => prev ? { ...prev, address: accounts[0] } : null);
        if (walletState === 'connected') checkEligibility(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);
    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged);
      eth.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletState, checkEligibility]);

  // ── Step 1: Approve NAKA ─────────────────────────────────────────────────────
  const approveNaka = async (): Promise<boolean> => {
    const { Contract } = await getEthers();
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const naka = new Contract(NAKA_ADDRESS, ERC20_ABI, signer);

    const tx = await naka.approve(SBT_ADDRESS, MINT_COST);
    await tx.wait();
    return true;
  };

  // ── Step 2: Mint ─────────────────────────────────────────────────────────────
  const mintSbt = async (): Promise<string> => {
    const { Contract } = await getEthers();
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const sbt = new Contract(SBT_ADDRESS, SBT_ABI, signer);

    const tx = await sbt.mint(wallet!.address);
    const receipt = await tx.wait();
    return receipt.hash as string;
  };

  // ── Handle full mint flow ─────────────────────────────────────────────────────
  const handleMint = async () => {
    if (!wallet || !eligibility) return;
    setErrorMsg('');
    setMintStep('checking');

    try {
      // Re-verify whitelist if applicable
      if (eligibility.isWhitelisted === false) {
        setErrorMsg('This wallet is not whitelisted. Only whitelist wallets can mint.');
        setMintStep('error');
        return;
      }
      if (eligibility.alreadyMinted) {
        setErrorMsg('This wallet has already minted a Naka Go SBT.');
        setMintStep('error');
        return;
      }
      if (!eligibility.hasEnough) {
        setErrorMsg(`Insufficient $NAKA balance. You need 227 $NAKA to mint. Your balance: ${fmtNaka(eligibility.nakaBalance)} $NAKA.`);
        setMintStep('error');
        return;
      }

      // Step 1: Approve if needed
      const needsApproval = eligibility.allowance < MINT_COST;
      if (needsApproval) {
        setMintStep('approving');
        await approveNaka();
      }

      // Step 2: Mint
      setMintStep('minting');
      const hash = await mintSbt();
      setTxHash(hash);
      setMintStep('success');

      // Refresh eligibility after success
      await checkEligibility(wallet.address);
    } catch (e: unknown) {
      const err = e as { code?: number | string; reason?: string; message?: string };
      setMintStep('error');
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setErrorMsg('Transaction rejected. Please confirm in MetaMask.');
      } else if (err.reason) {
        setErrorMsg(`Contract error: ${err.reason}`);
      } else if (err.message?.includes('insufficient funds')) {
        setErrorMsg('Insufficient ETH for gas fees. Please add ETH to your wallet.');
      } else {
        setErrorMsg(err.message ?? 'Mint failed. Please try again.');
      }
    }
  };

  // ── Mint button state logic ───────────────────────────────────────────────────
  const isMintDisabled =
    walletState !== 'connected' ||
    loadingEligibility ||
    mintStep === 'approving' ||
    mintStep === 'minting' ||
    eligibility?.alreadyMinted === true ||
    eligibility?.isWhitelisted === false ||
    !eligibility?.hasEnough;

  const mintBtnLabel = () => {
    if (mintStep === 'approving') return 'Approving $NAKA...';
    if (mintStep === 'minting')   return 'Minting SBT...';
    if (loadingEligibility)       return 'Checking eligibility...';
    if (eligibility?.alreadyMinted) return 'Already Minted';
    if (eligibility?.isWhitelisted === false) return 'Not Whitelisted';
    if (eligibility && !eligibility.hasEnough) return 'Insufficient $NAKA';
    if (eligibility?.allowance != null && eligibility.allowance < MINT_COST) return 'Approve + Mint (227 $NAKA)';
    return 'Mint Naka Go SBT (227 $NAKA + Gas)';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="container mx-auto px-4 py-28 max-w-2xl">
        {/* Back */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </motion.div>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-5"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.5))' }}
          >
            🎌
          </motion.div>
          <span
            className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.3em] mb-3 block"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            Soul Bound Token
          </span>
          <h1
            className="text-6xl md:text-7xl font-black text-white leading-none mb-4"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>M4NGA</span> SBT
          </h1>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            A non-transferable Soul Bound Token honoring the legacy of Naka Go. Whitelist only. One per wallet. Forever yours.
          </p>

          {/* Contract link */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-white/30 text-xs font-mono">Contract:</span>
            <a
              href={`https://etherscan.io/address/${SBT_ADDRESS}`}
              target="_blank" rel="noopener noreferrer"
              className="text-[#FF4D00] text-xs font-mono hover:underline flex items-center gap-1"
            >
              {shortAddr(SBT_ADDRESS)} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: '#0f0f0f', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 0 60px rgba(255,77,0,0.08)' }}
        >
          {/* SBT Art preview */}
          <div
            className="h-48 flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a0800, #0a0a1a)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="text-[90px]"
              style={{ filter: 'drop-shadow(0 0 30px rgba(255,77,0,0.6))' }}
            >
              🐕
            </motion.div>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.15) 0%, transparent 70%)' }}
            />
            {eligibility?.totalMinted != null && (
              <div
                className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,77,0,0.3)', color: '#FF4D00', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                {eligibility.totalMinted} MINTED
              </div>
            )}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,215,0,0.4)', color: '#FFD700', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              SBT · NON-TRANSFERABLE
            </div>
          </div>

          <div className="p-7 space-y-6">

            {/* ─ WALLET SECTION ─ */}
            <div>
              <div className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                1. Connect Wallet
              </div>

              {walletState === 'disconnected' && (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,77,0,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connectWallet}
                  className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-3 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    letterSpacing: '0.1em',
                    boxShadow: '0 0 25px rgba(255,77,0,0.35)',
                  }}
                >
                  <Wallet className="w-5 h-5" />
                  CONNECT METAMASK
                </motion.button>
              )}

              {walletState === 'connecting' && (
                <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white/60" style={{ background: '#1a1a1a' }}>
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF4D00]" />
                  <span className="font-bold">Connecting...</span>
                </div>
              )}

              {walletState === 'wrong-network' && (
                <div className="space-y-3">
                  <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(255,64,64,0.08)', border: '1px solid rgba(255,64,64,0.25)' }}>
                    <AlertCircle className="w-5 h-5 text-[#FF4040] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#FF4040] font-bold text-sm mb-1">Wrong Network</div>
                      <div className="text-white/50 text-xs">Please switch to Ethereum Mainnet to continue.</div>
                    </div>
                  </div>
                  <button
                    onClick={switchToMainnet}
                    className="w-full py-3 rounded-2xl text-white font-black text-sm cursor-pointer"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
                  >
                    SWITCH TO MAINNET
                  </button>
                </div>
              )}

              {walletState === 'connected' && wallet && (
                <div className="rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.15)' }}>
                      <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                    </div>
                    <div>
                      <div className="text-[#00FF88] text-xs font-bold mb-0.5">Connected</div>
                      <div className="text-white font-mono text-sm">{shortAddr(wallet.address)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setWalletState('disconnected'); setWallet(null); setEligibility(null); }}
                    className="text-white/30 text-xs hover:text-white/60 transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* ─ ELIGIBILITY SECTION ─ */}
            <AnimatePresence>
              {walletState === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                >
                  <div className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                    2. Eligibility
                  </div>

                  {loadingEligibility ? (
                    <div className="flex items-center gap-3 py-3 text-white/50">
                      <Loader2 className="w-4 h-4 animate-spin text-[#FF4D00]" />
                      <span className="text-sm">Checking eligibility...</span>
                    </div>
                  ) : eligibility ? (
                    <div className="space-y-3">
                      {/* Whitelist status */}
                      {eligibility.isWhitelisted !== null && (
                        <div
                          className="rounded-xl px-4 py-3 flex items-center gap-3"
                          style={{
                            background: eligibility.isWhitelisted ? 'rgba(0,255,136,0.06)' : 'rgba(255,64,64,0.06)',
                            border: `1px solid ${eligibility.isWhitelisted ? 'rgba(0,255,136,0.2)' : 'rgba(255,64,64,0.2)'}`,
                          }}
                        >
                          {eligibility.isWhitelisted
                            ? <ShieldCheck className="w-5 h-5 text-[#00FF88] flex-shrink-0" />
                            : <ShieldX className="w-5 h-5 text-[#FF4040] flex-shrink-0" />
                          }
                          <div>
                            <div className="font-bold text-sm" style={{ color: eligibility.isWhitelisted ? '#00FF88' : '#FF4040' }}>
                              {eligibility.isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}
                            </div>
                            <div className="text-white/40 text-xs">
                              {eligibility.isWhitelisted
                                ? 'This wallet is approved to mint.'
                                : 'This wallet is not on the whitelist.'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Already minted */}
                      {eligibility.alreadyMinted && (
                        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}>
                          <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                          <div>
                            <div className="font-bold text-sm text-[#FFD700]">Already Minted</div>
                            <div className="text-white/40 text-xs">You already own a Naka Go SBT. One per wallet.</div>
                          </div>
                        </div>
                      )}

                      {/* NAKA balance */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="text-white/35 text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                            $NAKA Balance
                          </div>
                          <div
                            className="font-black text-lg"
                            style={{
                              color: eligibility.hasEnough ? '#00FF88' : '#FF4040',
                              fontFamily: 'Bebas Neue, Impact, sans-serif',
                            }}
                          >
                            {fmtNaka(eligibility.nakaBalance)}
                          </div>
                          <div className="text-white/30 text-[10px] mt-0.5">Need: 227 $NAKA</div>
                        </div>
                        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="text-white/35 text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                            Allowance
                          </div>
                          <div
                            className="font-black text-lg"
                            style={{
                              color: eligibility.allowance >= MINT_COST ? '#00FF88' : '#FF9040',
                              fontFamily: 'Bebas Neue, Impact, sans-serif',
                            }}
                          >
                            {eligibility.allowance >= MINT_COST ? 'Approved' : 'Need Approval'}
                          </div>
                          <div className="text-white/30 text-[10px] mt-0.5">
                            {eligibility.allowance >= MINT_COST ? 'Ready to mint' : 'Step 1 required'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ MINT SECTION ─ */}
            <AnimatePresence>
              {walletState === 'connected' && !loadingEligibility && eligibility && !eligibility.alreadyMinted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                >
                  <div className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                    3. Mint
                  </div>

                  {/* 2-step indicator */}
                  {eligibility.allowance < MINT_COST && (
                    <div className="flex items-center gap-2 mb-4 text-white/40 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${mintStep === 'approving' ? 'bg-[#FF4D00] text-white' : 'bg-white/10 text-white/50'}`}>1</div>
                      <div className="flex-1 h-px" style={{ background: mintStep === 'minting' ? 'rgba(255,77,0,0.5)' : 'rgba(255,255,255,0.1)' }} />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${mintStep === 'minting' ? 'bg-[#FF4D00] text-white' : 'bg-white/10 text-white/50'}`}>2</div>
                      <div className="ml-2 flex-shrink-0">
                        {mintStep === 'approving' ? 'Approving $NAKA...' : mintStep === 'minting' ? 'Minting SBT...' : 'Approve then Mint'}
                      </div>
                    </div>
                  )}

                  {/* Mint button */}
                  <motion.button
                    whileHover={!isMintDisabled ? { scale: 1.02, boxShadow: '0 0 40px rgba(255,77,0,0.55)' } : {}}
                    whileTap={!isMintDisabled ? { scale: 0.98 } : {}}
                    onClick={handleMint}
                    disabled={isMintDisabled}
                    className="w-full py-5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-3 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: isMintDisabled ? '#1a1a1a' : 'linear-gradient(135deg, #FF4D00, #FF0000)',
                      fontFamily: 'Bebas Neue, Impact, sans-serif',
                      letterSpacing: '0.08em',
                      boxShadow: !isMintDisabled ? '0 0 30px rgba(255,77,0,0.4)' : 'none',
                    }}
                  >
                    {(mintStep === 'approving' || mintStep === 'minting' || mintStep === 'checking') && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {mintBtnLabel()}
                  </motion.button>

                  {/* Info note */}
                  <div className="flex items-start gap-2 mt-3 text-white/30 text-xs">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Minting requires 227 $NAKA tokens (2-step: approve then mint) plus ETH for gas. SBTs are non-transferable and cannot be sold or moved.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ SUCCESS STATE ─ */}
            <AnimatePresence>
              {mintStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.25)' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                    className="text-5xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <div className="text-[#00FF88] font-black text-xl mb-2" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                    SBT MINTED SUCCESSFULLY
                  </div>
                  <p className="text-white/50 text-sm mb-4">
                    Your Naka Go Soul Bound Token is now permanently in your wallet. Welcome to the cult.
                  </p>
                  {txHash && (
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#FF4D00] text-sm hover:underline"
                    >
                      View transaction on Etherscan <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ ERROR STATE ─ */}
            <AnimatePresence>
              {(mintStep === 'error' || errorMsg) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-4 flex items-start gap-3"
                  style={{ background: 'rgba(255,64,64,0.07)', border: '1px solid rgba(255,64,64,0.22)' }}
                >
                  <AlertCircle className="w-4 h-4 text-[#FF4040] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[#FF4040] text-sm font-bold mb-0.5">Error</div>
                    <div className="text-white/50 text-xs leading-relaxed">{errorMsg}</div>
                  </div>
                  <button
                    onClick={() => { setMintStep('idle'); setErrorMsg(''); }}
                    className="text-white/30 hover:text-white/60 text-xs cursor-pointer"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🎌', title: 'Whitelist Only', desc: 'Only approved wallets can mint this exclusive SBT.' },
            { icon: '⛓️', title: 'Non-Transferable', desc: 'Soul Bound means it stays in your wallet forever.' },
            { icon: '💰', title: '227 $NAKA', desc: 'Minting costs 227 $NAKA tokens plus ETH for gas.' },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="text-white font-black text-sm mb-2" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}>
                {card.title}
              </div>
              <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
