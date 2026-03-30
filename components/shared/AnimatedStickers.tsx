'use client';

import { motion, type TargetAndTransition } from 'framer-motion';
import Image from 'next/image';
import { MASCOT_URL } from '@/lib/utils/constants';

const M = MASCOT_URL;

// ── Base sticker wrapper ─────────────────────────────────────────────────────
function Sticker({
  size, children, anim, hover,
}: {
  size: number;
  children: React.ReactNode;
  anim?: TargetAndTransition;
  hover?: TargetAndTransition;
}) {
  return (
    <motion.div
      style={{ width: size, height: size, cursor: 'pointer', position: 'relative' }}
      animate={anim}
      whileHover={hover ?? { scale: 1.12, rotate: 3 }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.div>
  );
}

// ── NAKA GO IP! — mascot jumping on orange burst ──────────────────────────────
export function NakaGoSticker({ size = 180 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -16, 0], rotate: [0, 2, -2, 0] }}
      hover={{ scale: 1.15, rotate: 5, y: -8 }}
    >
      {/* Burst bg */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" width={size} height={size} className="absolute inset-0">
          <polygon points="100,5 120,70 185,70 133,110 154,175 100,138 46,175 67,110 15,70 80,70" fill="#FF4D00" opacity="0.85" />
        </svg>
      </motion.div>
      {/* Glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,77,0,0.4), transparent 70%)' }} />
      {/* Mascot */}
      <div className="absolute inset-[10%] rounded-full overflow-hidden" style={{ border: '3px solid rgba(255,77,0,0.8)', boxShadow: '0 0 20px rgba(255,77,0,0.8)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" />
      </div>
      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
        <span className="text-white font-black text-[11px] tracking-widest" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(255,77,0,1)', letterSpacing: '0.15em' }}>
          NAKA GO IP!
        </span>
      </div>
    </Sticker>
  );
}

// ── NAKA MOON — mascot on golden moon circle ──────────────────────────────────
export function MoonSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -14, 0] }}
      hover={{ scale: 1.13, rotate: -4, y: -6 }}
    >
      {/* Moon glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3), transparent 70%)' }} />
      {/* Moon circle */}
      <div className="absolute inset-[5%] rounded-full" style={{ background: 'linear-gradient(135deg, #2a2000, #1a1400)', border: '3px solid #FFD700', boxShadow: '0 0 25px rgba(255,215,0,0.5), inset 0 0 20px rgba(255,215,0,0.1)' }}>
        {/* Stars */}
        {[[20,15],[75,10],[15,65],[80,55],[10,90]].map(([x,y],i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-yellow-300"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        <div className="absolute inset-[12%] rounded-full overflow-hidden">
          <Image src={M} alt="Naka Go" fill className="object-cover" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-[#FFD700] font-black text-[11px]" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(255,215,0,0.8)', letterSpacing: '0.15em' }}>
          NAKA MOON
        </span>
      </div>
    </Sticker>
  );
}

// ── HODL — mascot with golden crown ──────────────────────────────────────────
export function HodlSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
      hover={{ scale: 1.14, y: -8 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.2), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #FFD700', boxShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" />
      </div>
      {/* Crown SVG */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2" width={size * 0.55} height={size * 0.3} viewBox="0 0 100 50">
        <polygon points="10,45 10,15 30,30 50,5 70,30 90,15 90,45" fill="#FFD700" stroke="#CC8800" strokeWidth="2" />
        <circle cx="50" cy="5" r="5" fill="#FF4D00" />
        <circle cx="10" cy="15" r="4" fill="#FF4D00" />
        <circle cx="90" cy="15" r="4" fill="#FF4D00" />
        <motion.path d="M50,5 L50,0" stroke="#FFD700" strokeWidth="1" strokeOpacity="0.6"
          animate={{ strokeOpacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-[#FFD700] font-black text-[12px]" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 10px rgba(255,215,0,0.9)', letterSpacing: '0.2em' }}>HODL</span>
      </div>
    </Sticker>
  );
}

// ── GM FRENS — green happy glow ───────────────────────────────────────────────
export function GmFrensSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ scale: [1, 1.04, 1], y: [0, -8, 0] }}
      hover={{ scale: 1.15, rotate: -5 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.25), transparent 70%)' }}
      />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #00FF88', boxShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'hue-rotate(10deg) saturate(1.2)' }} />
      </div>
      {/* Sparkles */}
      {[[10,20],[85,15],[5,75],[90,65],[50,5]].map(([x,y],i) => (
        <motion.div key={i} className="absolute text-[10px]" style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
        >✦</motion.div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[11px]" style={{ color: '#00FF88', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(0,255,136,0.9)', letterSpacing: '0.15em' }}>GM FRENS</span>
      </div>
    </Sticker>
  );
}

// ── 中号 — imperial kanji badge ──────────────────────────────────────────────
export function KanjiSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -12, 0] }}
      hover={{ scale: 1.12, rotate: 2 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.15), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid rgba(255,77,0,0.7)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'sepia(20%)' }} />
        {/* Overlay kanji */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className="text-2xl font-black text-[#FFD700]" style={{ textShadow: '0 0 15px rgba(255,215,0,0.8)', fontFamily: 'var(--font-noto-sans-jp)' }}>中号</span>
        </div>
      </div>
      {/* Corner decorations */}
      {[[4,4],[88,4],[4,88],[88,88]].map(([x,y],i) => (
        <motion.div key={i} className="absolute w-3 h-3 rounded-full bg-[#FFD700] opacity-60"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </Sticker>
  );
}

// ── WAGMI — rainbow glow ──────────────────────────────────────────────────────
export function WagmiSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ rotate: [0, 3, -3, 0], y: [0, -8, 0] }}
      hover={{ scale: 1.15, rotate: 8 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ background: 'conic-gradient(#FF4D00, #FFD700, #00FF88, #5B8EFF, #CC44FF, #FF4D00)', borderRadius: '50%' }}
      />
      <div className="absolute inset-[4%] rounded-full overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-[8%] rounded-full overflow-hidden">
          <Image src={M} alt="Naka Go" fill className="object-cover" />
        </div>
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <span className="font-black text-[11px] text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.15em', textShadow: '0 0 8px rgba(255,255,255,0.8)' }}>WAGMI</span>
      </div>
    </Sticker>
  );
}

// ── DIAMOND HANDS ─────────────────────────────────────────────────────────────
export function DiamondHandsSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
      hover={{ scale: 1.14, rotate: -6 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(91,142,255,0.2), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #5B8EFF', boxShadow: '0 0 20px rgba(91,142,255,0.5)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'saturate(0.9) brightness(1.05)' }} />
      </div>
      {/* Diamond SVG corner */}
      <svg className="absolute top-1 right-1" width={size * 0.22} height={size * 0.22} viewBox="0 0 40 40">
        <polygon points="20,2 35,18 20,38 5,18" fill="#A8EDFF" stroke="#5B8EFF" strokeWidth="1.5" />
        <polygon points="20,2 35,18 20,18 5,18" fill="white" opacity="0.3" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[11px]" style={{ color: '#5B8EFF', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(91,142,255,0.9)', letterSpacing: '0.15em' }}>DIAMOND HANDS</span>
      </div>
    </Sticker>
  );
}

// ── TO THE MOON — rocket trail ────────────────────────────────────────────────
export function RocketSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -20, 0], rotate: [-4, 4, -4] }}
      hover={{ scale: 1.18, rotate: -10, y: -12 }}
    >
      {/* Rocket trail */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 rounded-full"
        style={{ background: 'linear-gradient(to top, transparent, #FF4D00, #FFD700)', height: size * 0.35, opacity: 0.7 }}
        animate={{ scaleY: [0.8, 1.2, 0.8], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <div className="absolute inset-[10%] rounded-full overflow-hidden" style={{ border: '3px solid rgba(255,77,0,0.7)', boxShadow: '0 0 20px rgba(255,77,0,0.5)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" />
      </div>
      <div className="absolute top-1 left-0 right-0 text-center">
        <span className="font-black text-[10px]" style={{ color: '#FFD700', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(255,215,0,1)', letterSpacing: '0.12em' }}>TO THE MOON</span>
      </div>
    </Sticker>
  );
}

// ── THE CULT — purple dark vibes ──────────────────────────────────────────────
export function CultSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ scale: [1, 1.03, 1] }}
      hover={{ scale: 1.13, rotate: -4 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, rgba(204,68,255,0.3), transparent 70%)' }}
      />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #CC44FF', boxShadow: '0 0 25px rgba(204,68,255,0.6)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'hue-rotate(200deg) saturate(0.8) brightness(0.9)' }} />
      </div>
      {/* Orbiting dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-[#CC44FF]"
        style={{ top: '8%', left: '50%', transformOrigin: `0 ${size * 0.42}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[11px]" style={{ color: '#CC44FF', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(204,68,255,0.9)', letterSpacing: '0.15em' }}>THE CULT</span>
      </div>
    </Sticker>
  );
}

// ── BORN 1948 — vintage sepia ─────────────────────────────────────────────────
export function KimonoSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -10, 0] }}
      hover={{ scale: 1.12, rotate: 3 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.12), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid rgba(212,168,0,0.8)', boxShadow: '0 0 15px rgba(212,168,0,0.4)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'sepia(40%) saturate(1.3) brightness(0.95)' }} />
      </div>
      {/* Red seal-stamp overlay */}
      <div className="absolute bottom-[18%] right-[10%] w-8 h-8 rounded flex items-center justify-center"
        style={{ background: 'rgba(180,0,0,0.85)', border: '1px solid rgba(255,100,100,0.5)', rotate: '12deg' }}
      >
        <span className="text-white text-[8px] font-black" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>中</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[11px]" style={{ color: '#D4A800', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(212,168,0,0.8)', letterSpacing: '0.15em' }}>BORN 1948</span>
      </div>
    </Sticker>
  );
}

// ── BASED — cool blue cyber ───────────────────────────────────────────────────
export function BasedSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
      hover={{ scale: 1.13, rotate: 5 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.15), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #00FFFF', boxShadow: '0 0 20px rgba(0,255,255,0.4)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'saturate(0.7) hue-rotate(180deg) brightness(1.1)' }} />
      </div>
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-[8%] rounded-full pointer-events-none overflow-hidden"
        style={{ border: '3px solid transparent' }}
      >
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-[#00FFFF] opacity-30"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[12px]" style={{ color: '#00FFFF', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(0,255,255,0.9)', letterSpacing: '0.2em' }}>BASED</span>
      </div>
    </Sticker>
  );
}

// ── FIRE — on fire pulse ──────────────────────────────────────────────────────
export function FireSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ scale: [1, 1.05, 1] }}
      hover={{ scale: 1.16, y: -6 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.5), transparent 70%)' }}
      />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #FF4D00', boxShadow: '0 0 30px rgba(255,77,0,0.8)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'saturate(1.5) brightness(1.1)' }} />
      </div>
      {/* Flame particles */}
      {[20, 50, 80].map((x, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[10%] text-base"
          style={{ left: `${x}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.8, 0, 0.8], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
        >🔥</motion.div>
      ))}
      <div className="absolute top-1 left-0 right-0 text-center">
        <span className="font-black text-[12px]" style={{ color: '#FF4D00', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 10px #FF4D00', letterSpacing: '0.2em' }}>ON FIRE</span>
      </div>
    </Sticker>
  );
}

// ── ICE CREAM / COOKIES sticker ───────────────────────────────────────────────
export function CookieSticker({ size = 160 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ rotate: [0, 6, -6, 0], y: [0, -8, 0] }}
      hover={{ scale: 1.13, rotate: -8 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,130,42,0.2), transparent 70%)' }} />
      <div className="absolute inset-[8%] rounded-full overflow-hidden" style={{ border: '3px solid #D4822A', boxShadow: '0 0 15px rgba(212,130,42,0.5)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" style={{ filter: 'sepia(30%) saturate(1.4) hue-rotate(-10deg)' }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-black text-[10px]" style={{ color: '#D4822A', fontFamily: 'Bebas Neue, Impact, sans-serif', textShadow: '0 0 8px rgba(212,130,42,0.8)', letterSpacing: '0.12em' }}>COOKIES & CREAM</span>
      </div>
    </Sticker>
  );
}

// ── IceCreamSticker alias ─────────────────────────────────────────────────────
export function IceCreamSticker({ size = 160 }: { size?: number }) {
  return <GmFrensSticker size={size} />;
}

// ── NakaGoIPSticker — extra "IP" variant ─────────────────────────────────────
export function NakaGoIPSticker({ size = 180 }: { size?: number }) {
  return (
    <Sticker
      size={size}
      anim={{ y: [0, -18, 0], scale: [1, 1.03, 1] }}
      hover={{ scale: 1.18, rotate: 6, y: -10 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.3), transparent 65%)' }} />
      <div className="absolute inset-[6%] rounded-full overflow-hidden" style={{ border: '4px solid #FF4D00', boxShadow: '0 0 30px rgba(255,77,0,0.7)' }}>
        <Image src={M} alt="Naka Go" fill className="object-cover" />
      </div>
      {/* Animated ring */}
      <motion.div
        className="absolute inset-[3%] rounded-full"
        style={{ border: '2px dashed rgba(255,77,0,0.5)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute -bottom-1 left-0 right-0 text-center">
        <div className="inline-block px-3 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 12px rgba(255,77,0,0.7)' }}>
          <span className="font-black text-white text-[11px]" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.2em' }}>NAKA GO IP!</span>
        </div>
      </div>
    </Sticker>
  );
}
