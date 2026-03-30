'use client';

import { motion, type TargetAndTransition } from 'framer-motion';
import Image from 'next/image';
import { MASCOT_URL } from '@/lib/utils/constants';

const M = MASCOT_URL;

// ── Base sticker — looks like a real die-cut sticker card ────────────────────
function Sticker({
  size,
  label,
  accent,
  bg,
  delay = 0,
  children,
  anim,
}: {
  size: number;
  label: string;
  accent: string;
  bg: string;
  delay?: number;
  children?: React.ReactNode;
  anim?: TargetAndTransition;
}) {
  return (
    <motion.div
      style={{
        width: size,
        flexShrink: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
      animate={anim ?? { y: [0, -8, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={{ scale: 1.12, rotate: 3 }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Sticker card */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 20,
          border: '6px solid #FFFFFF',
          background: bg,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)`,
        }}
      >
        {/* Photo */}
        <Image src={M} alt={label} fill className="object-cover object-center" />
        {/* Bottom label band */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '6px 4px 5px',
            background: `linear-gradient(to top, ${accent}EE 0%, ${accent}99 60%, transparent 100%)`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: Math.round(size * 0.14),
              color: '#fff',
              letterSpacing: '0.12em',
              textShadow: `0 1px 4px rgba(0,0,0,0.9), 0 0 12px ${accent}`,
              lineHeight: 1.1,
            }}
          >
            {label}
          </span>
        </div>
        {/* Decorative overlay from children */}
        {children}
      </div>
    </motion.div>
  );
}

// ── NAKA GO UP! ───────────────────────────────────────────────────────────────
export function NakaGoIPSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="NAKA GO UP!" accent="#FF4D00" bg="#1a0800" delay={0}>
      {/* Star burst top-right */}
      <motion.div
        style={{ position: 'absolute', top: 4, right: 4 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 30 30">
          <polygon points="15,2 18,11 28,11 20,17 23,26 15,20 7,26 10,17 2,11 12,11" fill="#FF4D00" />
        </svg>
      </motion.div>
    </Sticker>
  );
}

export function NakaGoSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="NAKA GO" accent="#FF4D00" bg="#1a0800" delay={0.3}>
      <div style={{ position: 'absolute', top: 4, left: 4 }}>
        <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 30 30">
          <polygon points="15,2 18,11 28,11 20,17 23,26 15,20 7,26 10,17 2,11 12,11" fill="#FF4D00" />
        </svg>
      </div>
    </Sticker>
  );
}

// ── NAKA MOON ─────────────────────────────────────────────────────────────────
export function MoonSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="NAKA MOON" accent="#FFD700" bg="#0a0a1a" delay={0.5}>
      {/* Stars */}
      {[[10, 10], [80, 8], [88, 30], [5, 55]].map(([x, y], i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 4, height: 4, borderRadius: '50%', background: '#FFD700' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </Sticker>
  );
}

// ── HODL ──────────────────────────────────────────────────────────────────────
export function HodlSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="HODL" accent="#FFD700" bg="#100800" delay={0.2}>
      {/* Crown */}
      <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)' }}>
        <svg width={size * 0.4} height={size * 0.2} viewBox="0 0 80 35">
          <polygon points="5,30 5,10 22,22 40,2 58,22 75,10 75,30" fill="#FFD700" stroke="#CC8800" strokeWidth="2" />
          <circle cx="40" cy="2" r="5" fill="#FF4D00" />
          <circle cx="5" cy="10" r="3.5" fill="#FF4D00" />
          <circle cx="75" cy="10" r="3.5" fill="#FF4D00" />
        </svg>
      </div>
    </Sticker>
  );
}

// ── GM FRENS ──────────────────────────────────────────────────────────────────
export function GmFrensSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="GM FRENS" accent="#00FF88" bg="#001a0a" delay={0.7}
      anim={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
    />
  );
}

// ── WAGMI ────────────────────────────────────────────────────────────────────
export function WagmiSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="WAGMI" accent="#CC44FF" bg="#0d0020" delay={0.4}>
      {/* Spinning rainbow ring overlay */}
      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: 14, opacity: 0.35 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 14, background: 'conic-gradient(from 0deg, #FF4D00, #FFD700, #00FF88, #00FFFF, #CC44FF, #FF4D00)', opacity: 0.5 }} />
      </motion.div>
    </Sticker>
  );
}

// ── DIAMOND HANDS ────────────────────────────────────────────────────────────
export function DiamondHandsSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="DIAMOND HANDS" accent="#00BFFF" bg="#001020" delay={0.9}>
      <div style={{ position: 'absolute', top: 4, right: 4 }}>
        <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 30 30">
          <polygon points="15,2 28,12 22,28 8,28 2,12" fill="none" stroke="#00BFFF" strokeWidth="2" opacity="0.8" />
          <polygon points="15,5 25,13 20,26 10,26 5,13" fill="#00BFFF" opacity="0.3" />
        </svg>
      </div>
    </Sticker>
  );
}

// ── ROCKET ───────────────────────────────────────────────────────────────────
export function RocketSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="TO THE MOON" accent="#FF6B00" bg="#120800" delay={1.1}
      anim={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
    >
      <div style={{ position: 'absolute', top: 3, right: 5 }}>
        <svg width={size * 0.2} height={size * 0.2} viewBox="0 0 28 28">
          <path d="M14 2 C14 2 22 6 22 14 L18 18 L10 18 L6 14 C6 6 14 2 14 2Z" fill="#FF6B00" opacity="0.9" />
          <circle cx="14" cy="12" r="3" fill="white" opacity="0.7" />
          <path d="M10 18 L8 24 L14 20 L20 24 L18 18Z" fill="#FFD700" opacity="0.8" />
        </svg>
      </div>
    </Sticker>
  );
}

// ── THE CULT ─────────────────────────────────────────────────────────────────
export function CultSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="THE CULT" accent="#9B30FF" bg="#0d0020" delay={0.6}>
      <motion.div
        style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderRadius: '50%', background: '#9B30FF' }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </Sticker>
  );
}

// ── KIMONO ───────────────────────────────────────────────────────────────────
export function KimonoSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="BORN 1948" accent="#FF4D00" bg="#1a0800" delay={0.8}>
      <div style={{ position: 'absolute', top: 4, left: 4 }}>
        <div style={{ width: size * 0.2, height: size * 0.2, borderRadius: 4, background: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', opacity: 0.85 }}>
          <span style={{ color: 'white', fontSize: size * 0.1, fontFamily: 'serif', fontWeight: 'bold' }}>中</span>
        </div>
      </div>
    </Sticker>
  );
}

// ── KANJI ────────────────────────────────────────────────────────────────────
export function KanjiSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="中号" accent="#FFD700" bg="#0a0800" delay={1.2}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-80%)', opacity: 0.18 }}>
        <span style={{ fontSize: size * 0.7, fontFamily: 'serif', color: '#FFD700', fontWeight: 'bold', lineHeight: 1 }}>中</span>
      </div>
    </Sticker>
  );
}

// ── BASED ────────────────────────────────────────────────────────────────────
export function BasedSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="BASED" accent="#00FFFF" bg="#001a1a" delay={1.4}>
      {/* Scan line */}
      <motion.div
        style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'rgba(0,255,255,0.4)', top: 0 }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Sticker>
  );
}

// ── FIRE ─────────────────────────────────────────────────────────────────────
export function FireSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="ON FIRE" accent="#FF2200" bg="#1a0000" delay={0.15}
      anim={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
    />
  );
}

// ── COOKIE ───────────────────────────────────────────────────────────────────
export function CookieSticker({ size = 150 }: { size?: number }) {
  return (
    <Sticker size={size} label="COOKIES & CREAM" accent="#CC8800" bg="#1a0f00" delay={1.0}>
      <div style={{ position: 'absolute', top: 4, right: 4, fontSize: size * 0.12 }}>🍪</div>
    </Sticker>
  );
}
