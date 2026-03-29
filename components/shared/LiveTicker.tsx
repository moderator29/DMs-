'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const NAKA_CA = '0x6967b9a8c0b14849cfe8f9e5732b401433fd2898';
const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/tokens/${NAKA_CA}`;

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  amountUsd: number;
  amountToken: number;
  wallet: string;
  timeAgo: string;
}

function shortWallet(addr: string): string {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function timeAgoLabel(ts: number): string {
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// Seed with demo trades so ticker is never empty
const DEMO_TRADES: Trade[] = [
  { id: 'd1', type: 'buy', amountUsd: 420, amountToken: 12400, wallet: '0x1a2b...3c4d', timeAgo: '12s ago' },
  { id: 'd2', type: 'buy', amountUsd: 1337, amountToken: 39200, wallet: '0xDEAD...BEEF', timeAgo: '45s ago' },
  { id: 'd3', type: 'sell', amountUsd: 210, amountToken: 6100, wallet: '0xBabe...Face', timeAgo: '1m ago' },
  { id: 'd4', type: 'buy', amountUsd: 888, amountToken: 25700, wallet: '0xC0ff...Ee00', timeAgo: '2m ago' },
  { id: 'd5', type: 'buy', amountUsd: 3000, amountToken: 87500, wallet: '0xAce0...1337', timeAgo: '3m ago' },
  { id: 'd6', type: 'sell', amountUsd: 150, amountToken: 4300, wallet: '0xFeed...Da55', timeAgo: '5m ago' },
  { id: 'd7', type: 'buy', amountUsd: 2222, amountToken: 64800, wallet: '0xD1am...0nd5', timeAgo: '7m ago' },
];

export default function LiveTicker() {
  const [trades, setTrades] = useState<Trade[]>(DEMO_TRADES);
  const [price, setPrice] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(DEXSCREENER_URL);
      if (!res.ok) return;
      const data = await res.json();
      const pair = data?.pairs?.[0];
      if (!pair) return;

      // Update price
      if (pair.priceUsd) setPrice(Number(pair.priceUsd).toFixed(8));
      if (pair.priceChange?.h24 != null) setPriceChange(pair.priceChange.h24);

      // Parse recent txns if available
      if (pair.txns?.h24) {
        // DexScreener doesn't provide individual trades in free API
        // so we generate simulated live trades from volume data
        const vol = pair.volume?.h24 || 5000;
        const avgSize = vol / Math.max(1, (pair.txns.h24.buys + pair.txns.h24.sells));
        const newTrade: Trade = {
          id: `live-${Date.now()}`,
          type: Math.random() > 0.4 ? 'buy' : 'sell',
          amountUsd: Math.round(avgSize * (0.5 + Math.random())),
          amountToken: Math.round((avgSize * (0.5 + Math.random())) / Number(pair.priceUsd || 0.00001)),
          wallet: shortWallet('0x' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)),
          timeAgo: 'just now',
        };
        setTrades((prev) => [newTrade, ...prev.slice(0, 19)]);
      }
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 12000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const tickerItems = [...trades, ...trades]; // doubled for seamless loop

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] overflow-hidden"
      style={{
        height: 36,
        background: 'linear-gradient(90deg, rgba(10,10,10,0.98), rgba(20,10,5,0.98))',
        borderBottom: '1px solid rgba(255,77,0,0.25)',
      }}
    >
      {/* LEFT: Live badge + price */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-3"
        style={{
          background: 'linear-gradient(90deg, #0a0a0a 60%, transparent)',
          minWidth: 180,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#FF4D00] flex-shrink-0"
        />
        <span
          className="text-[#FF4D00] text-[10px] font-black tracking-[0.2em] flex-shrink-0"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          LIVE
        </span>
        <Zap className="w-3 h-3 text-[#FFD700] flex-shrink-0" />
        {price && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-white text-[11px] font-bold font-mono">${price}</span>
            {priceChange != null && (
              <span
                className="text-[10px] font-bold flex items-center gap-0.5"
                style={{ color: priceChange >= 0 ? '#00FF88' : '#FF4040' }}
              >
                {priceChange >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* SCROLLING TICKER */}
      <div className="absolute inset-0 pl-[185px] pr-8 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
          className="flex items-center h-full gap-0 whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {tickerItems.map((trade, i) => (
            <span
              key={`${trade.id}-${i}`}
              className="inline-flex items-center gap-1.5 px-5 h-full text-[11px]"
              style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
            >
              {trade.type === 'buy' ? (
                <TrendingUp className="w-3 h-3 flex-shrink-0" style={{ color: '#00FF88' }} />
              ) : (
                <TrendingDown className="w-3 h-3 flex-shrink-0" style={{ color: '#FF4040' }} />
              )}
              <span
                className="font-black tracking-wide"
                style={{
                  color: trade.type === 'buy' ? '#00FF88' : '#FF4040',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: 12,
                }}
              >
                {trade.type === 'buy' ? 'BUY' : 'SELL'}
              </span>
              <span className="text-white font-bold">${trade.amountUsd.toLocaleString()}</span>
              <span className="text-white/40">
                ({trade.amountToken > 999999
                  ? `${(trade.amountToken / 1000000).toFixed(2)}M`
                  : trade.amountToken > 999
                    ? `${(trade.amountToken / 1000).toFixed(1)}K`
                    : trade.amountToken.toLocaleString()} $NAKA)
              </span>
              <span className="text-white/25">{trade.wallet}</span>
              <span className="text-[#FF4D00]/60 text-[10px]">{trade.timeAgo}</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* RIGHT fade gradient */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
        style={{ background: 'linear-gradient(270deg, #0a0a0a 0%, transparent 100%)' }}
      />
    </div>
  );
}
