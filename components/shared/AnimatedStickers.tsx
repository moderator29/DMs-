'use client';

import { motion } from 'framer-motion';

// ── Cartoon Shiba Inu SVG sticker components ──────────────────────────────────
// Each is a transparent-bg SVG with drop-shadow white outline for sticker effect.

type Expression = 'happy' | 'big-smile' | 'o-mouth' | 'smug' | 'sad' | 'laser' | 'dollar' | 'stars';

// ── Base Shiba face (reusable SVG group) ──────────────────────────────────────
function ShibaFace({ expression = 'happy' }: { expression?: Expression }) {
  return (
    <g>
      {/* Left ear — outer/back layer */}
      <polygon points="22,5 4,48 42,50" fill="#D67A18" />
      {/* Left ear — main orange */}
      <polygon points="22,8 8,46 40,48" fill="#F5A035" />
      {/* Left ear — pink inner */}
      <polygon points="22,16 14,43 36,46" fill="#FFB8B8" />

      {/* Right ear — outer/back */}
      <polygon points="98,5 116,48 78,50" fill="#D67A18" />
      {/* Right ear — main orange */}
      <polygon points="98,8 112,46 80,48" fill="#F5A035" />
      {/* Right ear — pink inner */}
      <polygon points="98,16 106,43 84,46" fill="#FFB8B8" />

      {/* Head outline (slightly larger, darker) */}
      <ellipse cx="60" cy="73" rx="52" ry="49" fill="#D67A18" />
      {/* Head main fill */}
      <ellipse cx="60" cy="71" rx="50" ry="47" fill="#F5A035" />
      {/* Forehead lighter patch */}
      <ellipse cx="60" cy="50" rx="22" ry="16" fill="#F8B84A" />

      {/* White muzzle */}
      <ellipse cx="60" cy="86" rx="25" ry="18" fill="#FFF3E0" />

      {/* Eyes */}
      {expression === 'laser' ? (
        <>
          <ellipse cx="43" cy="67" rx="10" ry="10" fill="#AA0000" />
          <ellipse cx="77" cy="67" rx="10" ry="10" fill="#AA0000" />
          <ellipse cx="44" cy="64" rx="3.5" ry="3.5" fill="#FF4D00" />
          <ellipse cx="78" cy="64" rx="3.5" ry="3.5" fill="#FF4D00" />
        </>
      ) : expression === 'dollar' ? (
        <>
          <ellipse cx="43" cy="67" rx="10" ry="10" fill="#1A0900" />
          <ellipse cx="77" cy="67" rx="10" ry="10" fill="#1A0900" />
          <text x="43" y="72" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">$</text>
          <text x="77" y="72" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">$</text>
        </>
      ) : expression === 'stars' ? (
        <>
          <ellipse cx="43" cy="67" rx="10" ry="10" fill="#1A0900" />
          <ellipse cx="77" cy="67" rx="10" ry="10" fill="#1A0900" />
          <text x="43" y="72" textAnchor="middle" fill="#FFD700" fontSize="12" fontFamily="Arial, sans-serif">★</text>
          <text x="77" y="72" textAnchor="middle" fill="#FFD700" fontSize="12" fontFamily="Arial, sans-serif">★</text>
        </>
      ) : (
        <>
          <ellipse cx="43" cy="67" rx="10" ry="10" fill="#1A0900" />
          <ellipse cx="77" cy="67" rx="10" ry="10" fill="#1A0900" />
          {/* Eye shine */}
          <ellipse cx="45" cy="63" rx="3.5" ry="3.5" fill="white" />
          <ellipse cx="79" cy="63" rx="3.5" ry="3.5" fill="white" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="60" cy="80" rx="5.5" ry="4" fill="#1A0900" />

      {/* Blush cheeks */}
      <ellipse cx="27" cy="78" rx="11" ry="8" fill="rgba(255,110,100,0.38)" />
      <ellipse cx="93" cy="78" rx="11" ry="8" fill="rgba(255,110,100,0.38)" />

      {/* Mouth — varies by expression */}
      {expression === 'happy' && (
        <path d="M50 89 Q60 99 70 89" fill="none" stroke="#1A0900" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'big-smile' && (
        <path d="M46 89 Q60 103 74 89" fill="#FF8A80" stroke="#1A0900" strokeWidth="2" strokeLinejoin="round" />
      )}
      {expression === 'o-mouth' && (
        <ellipse cx="60" cy="93" rx="9" ry="11" fill="#FF8A80" stroke="#1A0900" strokeWidth="2" />
      )}
      {expression === 'smug' && (
        <path d="M50 91 Q60 95 72 88" fill="none" stroke="#1A0900" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'sad' && (
        <>
          <path d="M50 94 Q60 87 70 94" fill="none" stroke="#1A0900" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tears */}
          <ellipse cx="36" cy="77" rx="4.5" ry="8" fill="#90CAF9" opacity="0.88" />
          <ellipse cx="84" cy="77" rx="4.5" ry="8" fill="#90CAF9" opacity="0.88" />
        </>
      )}
      {(expression === 'laser' || expression === 'dollar' || expression === 'stars') && (
        <path d="M50 89 Q60 99 70 89" fill="none" stroke="#1A0900" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </g>
  );
}

// ── Sticker wrapper — float animation + white drop-shadow outline ──────────────
function StickerWrap({
  delay = 0,
  anim,
  children,
}: {
  delay?: number;
  anim?: object;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
      animate={anim ?? { y: [0, -10, 0] }}
      transition={{ duration: 3.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={{ scale: 1.18, rotate: 6, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.9 }}
    >
      <div style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.95)) drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 10px 24px rgba(0,0,0,0.75))' }}>
        {children}
      </div>
    </motion.div>
  );
}

// ViewBox for all stickers: 0 0 120 125
// (includes room for accessories above/below the head)

// ── 1. NAKA GO UP! — happy with rocket ───────────────────────────────────────
export function NakaGoIPSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="big-smile" />
        {/* Rocket top-right */}
        <g transform="translate(82,0) rotate(35)">
          <rect x="4" y="2" width="12" height="24" rx="6" fill="#FF4D00" />
          <polygon points="10,0 4,8 16,8" fill="#FF6B00" />
          <polygon points="10,26 4,20 4,30" fill="#FFD700" />
          <polygon points="10,26 16,20 16,30" fill="#FFD700" />
          <circle cx="10" cy="13" r="4" fill="white" opacity="0.7" />
        </g>
        {/* Stars */}
        <text x="5" y="22" fill="#FFD700" fontSize="10" fontFamily="Arial">★</text>
        <text x="100" y="18" fill="#FF4D00" fontSize="8" fontFamily="Arial">✦</text>
        {/* Bold label */}
        <text x="60" y="120" textAnchor="middle" fill="#FF4D00" fontSize="13" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2" stroke="white" strokeWidth="4" paintOrder="stroke">NAKA GO UP!</text>
      </svg>
    </StickerWrap>
  );
}

// ── 2. NAKA GO — standard happy ───────────────────────────────────────────────
export function NakaGoSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.3}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="happy" />
        {/* Small star accents */}
        <text x="8" y="25" fill="#FF4D00" fontSize="9" fontFamily="Arial">★</text>
        <text x="104" y="30" fill="#FFD700" fontSize="8" fontFamily="Arial">★</text>
        <text x="60" y="120" textAnchor="middle" fill="#FF4D00" fontSize="15" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="white" strokeWidth="4" paintOrder="stroke">NAKA GO</text>
      </svg>
    </StickerWrap>
  );
}

// ── 3. NAKA MOON — star eyes, crescent above ──────────────────────────────────
export function MoonSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.5} anim={{ y: [0, -12, 0], rotate: [0, -3, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="stars" />
        {/* Crescent moon above */}
        <path d="M50,10 A18,18 0 0,0 72,10 A12,12 0 0,1 50,10" fill="#FFD700" />
        {/* Stars */}
        <text x="6" y="18" fill="#FFD700" fontSize="8" fontFamily="Arial">★</text>
        <text x="105" y="15" fill="#FFD700" fontSize="7" fontFamily="Arial">★</text>
        <text x="14" y="38" fill="#FFD700" fontSize="6" fontFamily="Arial">✦</text>
        <text x="100" y="42" fill="#FFD700" fontSize="6" fontFamily="Arial">✦</text>
        <text x="60" y="120" textAnchor="middle" fill="#FFD700" fontSize="13" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2" stroke="#1A0900" strokeWidth="4" paintOrder="stroke">NAKA MOON</text>
      </svg>
    </StickerWrap>
  );
}

// ── 4. HODL — crown, smug expression ─────────────────────────────────────────
export function HodlSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.2}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="smug" />
        {/* Crown */}
        <polygon points="30,28 30,6 45,16 60,2 75,16 90,6 90,28" fill="#FFD700" stroke="#CC8800" strokeWidth="1.5" />
        <circle cx="60" cy="4" r="5" fill="#FF4D00" />
        <circle cx="30" cy="7" r="3.5" fill="#FF4D00" />
        <circle cx="90" cy="7" r="3.5" fill="#FF4D00" />
        {/* Crown gems */}
        <circle cx="60" cy="20" r="3" fill="#00BFFF" />
        <text x="60" y="120" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="#1A0900" strokeWidth="4" paintOrder="stroke">HODL</text>
      </svg>
    </StickerWrap>
  );
}

// Pre-computed sun ray endpoints for GmFrensSticker (avoids Math calls in render)
// angles: 0, 40, 80, 120, 160, 200, 240, 280, 320 degrees
// x2 = 60 + cos(angle) * 16, y2 = 10 + sin(angle) * 16
const SUN_RAYS = [
  { x2: 76.0,  y2: 10.0  },
  { x2: 72.3,  y2: 20.3  },
  { x2: 62.8,  y2: 25.8  },
  { x2: 52.0,  y2: 23.9  },
  { x2: 44.9,  y2: 15.5  },
  { x2: 44.1,  y2: 4.5   },
  { x2: 49.7,  y2: -5.3  },
  { x2: 60.9,  y2: -5.9  },
  { x2: 70.6,  y2: 0.9   },
];

// ── 5. GM FRENS — happy with sun rays ────────────────────────────────────────
export function GmFrensSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.7} anim={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="big-smile" />
        {/* Sun rays around top */}
        {SUN_RAYS.map((ray, i) => (
          <line key={i} x1="60" y1="10" x2={ray.x2} y2={ray.y2} stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        ))}
        <circle cx="60" cy="10" r="7" fill="#FFD700" />
        <text x="60" y="120" textAnchor="middle" fill="#FF8C00" fontSize="12" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2" stroke="white" strokeWidth="4" paintOrder="stroke">GM FRENS</text>
      </svg>
    </StickerWrap>
  );
}

// ── 6. WAGMI — rainbow, fist pump ────────────────────────────────────────────
export function WagmiSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.4} anim={{ y: [0, -14, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="big-smile" />
        {/* Rainbow arc */}
        <path d="M10,55 Q10,20 60,20 Q110,20 110,55" fill="none" stroke="#FF4D00" strokeWidth="4" opacity="0.9" />
        <path d="M14,57 Q14,24 60,24 Q106,24 106,57" fill="none" stroke="#FFD700" strokeWidth="4" opacity="0.9" />
        <path d="M18,59 Q18,28 60,28 Q102,28 102,59" fill="none" stroke="#00CC66" strokeWidth="4" opacity="0.9" />
        <path d="M22,61 Q22,32 60,32 Q98,32 98,61" fill="none" stroke="#00BFFF" strokeWidth="4" opacity="0.9" />
        <text x="60" y="120" textAnchor="middle" fill="#CC44FF" fontSize="15" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="white" strokeWidth="4" paintOrder="stroke">WAGMI</text>
      </svg>
    </StickerWrap>
  );
}

// ── 7. DIAMOND HANDS — dollar eyes, diamond icon ─────────────────────────────
export function DiamondHandsSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.9}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="dollar" />
        {/* Diamond top-left */}
        <polygon points="12,20 20,10 28,20 20,35" fill="#00BFFF" stroke="#0080CC" strokeWidth="1.5" />
        <polygon points="12,20 20,10 20,35" fill="#80DFFF" opacity="0.7" />
        {/* Diamond top-right */}
        <polygon points="92,20 100,10 108,20 100,35" fill="#00BFFF" stroke="#0080CC" strokeWidth="1.5" />
        <polygon points="92,20 100,10 100,35" fill="#80DFFF" opacity="0.7" />
        <text x="60" y="120" textAnchor="middle" fill="#00BFFF" fontSize="11" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="1.5" stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke">DIAMOND HANDS</text>
      </svg>
    </StickerWrap>
  );
}

// ── 8. TO THE MOON — rocket ride ─────────────────────────────────────────────
export function RocketSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={1.1} anim={{ y: [0, -16, 0], rotate: [0, 3, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="o-mouth" />
        {/* Rocket going up-right */}
        <g transform="translate(80,-2) rotate(30)">
          <rect x="3" y="2" width="14" height="28" rx="7" fill="#FF4D00" />
          <polygon points="10,0 3,8 17,8" fill="#FF6B00" />
          <circle cx="10" cy="14" r="5" fill="white" opacity="0.65" />
          <polygon points="10,30 2,22 2,36" fill="#FFD700" />
          <polygon points="10,30 18,22 18,36" fill="#FFD700" />
        </g>
        {/* Speed lines */}
        <line x1="60" y1="8" x2="72" y2="2" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="64" y1="15" x2="80" y2="10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <text x="60" y="120" textAnchor="middle" fill="#FF6B00" fontSize="12" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2" stroke="white" strokeWidth="4" paintOrder="stroke">TO THE MOON</text>
      </svg>
    </StickerWrap>
  );
}

// ── 9. THE CULT — mysterious hood, laser eyes ────────────────────────────────
export function CultSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.6} anim={{ y: [0, -8, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="laser" />
        {/* Laser beams from eyes */}
        <line x1="33" y1="67" x2="0" y2="75" stroke="#FF0000" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <line x1="87" y1="67" x2="120" y2="75" stroke="#FF0000" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        {/* Glow at laser tips */}
        <circle cx="0" cy="75" r="4" fill="#FF0000" opacity="0.6" />
        <circle cx="120" cy="75" r="4" fill="#FF0000" opacity="0.6" />
        {/* Cult symbol */}
        <circle cx="60" cy="12" r="9" fill="none" stroke="#9B30FF" strokeWidth="2.5" />
        <polygon points="60,4 63,9 68,9 64,13 66,18 60,15 54,18 56,13 52,9 57,9" fill="#9B30FF" opacity="0.85" />
        <text x="60" y="120" textAnchor="middle" fill="#9B30FF" fontSize="13" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2.5" stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke">THE CULT</text>
      </svg>
    </StickerWrap>
  );
}

// ── 10. BORN 1948 — kanji stamp + happy ──────────────────────────────────────
export function KimonoSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.8}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="smug" />
        {/* Red stamp/seal */}
        <rect x="78" y="4" width="36" height="28" rx="4" fill="#CC0000" opacity="0.9" transform="rotate(-8,96,18)" />
        <text x="96" y="23" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="serif" transform="rotate(-8,96,18)">中</text>
        <text x="60" y="120" textAnchor="middle" fill="#FF4D00" fontSize="13" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2" stroke="white" strokeWidth="4" paintOrder="stroke">BORN 1948</text>
      </svg>
    </StickerWrap>
  );
}

// ── 11. 中号 — large kanji watermark, happy ───────────────────────────────────
export function KanjiSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={1.2} anim={{ y: [0, -10, 0], rotate: [0, -4, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bg kanji watermark */}
        <text x="60" y="88" textAnchor="middle" fill="#FFD700" fontSize="82" fontFamily="serif" opacity="0.12">中</text>
        <ShibaFace expression="happy" />
        <text x="60" y="120" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="#1A0900" strokeWidth="4" paintOrder="stroke">中号</text>
      </svg>
    </StickerWrap>
  );
}

// ── 12. BASED — sunglasses, smug ─────────────────────────────────────────────
export function BasedSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={1.4} anim={{ y: [0, -8, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="smug" />
        {/* Cool sunglasses */}
        <rect x="28" y="58" width="26" height="18" rx="5" fill="#00FFFF" opacity="0.85" />
        <rect x="66" y="58" width="26" height="18" rx="5" fill="#00FFFF" opacity="0.85" />
        {/* Bridge */}
        <line x1="54" y1="67" x2="66" y2="67" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* Frame outline */}
        <rect x="28" y="58" width="26" height="18" rx="5" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
        <rect x="66" y="58" width="26" height="18" rx="5" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
        {/* Side arms */}
        <line x1="28" y1="66" x2="18" y2="63" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
        <line x1="92" y1="66" x2="102" y2="63" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
        <text x="60" y="120" textAnchor="middle" fill="#00FFFF" fontSize="16" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke">BASED</text>
      </svg>
    </StickerWrap>
  );
}

// ── 13. ON FIRE — flames around head ──────────────────────────────────────────
export function FireSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={0.15} anim={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="big-smile" />
        {/* Flame left */}
        <path d="M15,65 Q8,48 14,35 Q18,48 22,38 Q26,50 20,65Z" fill="#FF4D00" opacity="0.9" />
        <path d="M16,65 Q11,52 16,42 Q19,52 21,65Z" fill="#FFD700" opacity="0.8" />
        {/* Flame right */}
        <path d="M105,65 Q112,48 106,35 Q102,48 98,38 Q94,50 100,65Z" fill="#FF4D00" opacity="0.9" />
        <path d="M104,65 Q109,52 104,42 Q101,52 99,65Z" fill="#FFD700" opacity="0.8" />
        {/* Flame top */}
        <path d="M45,25 Q38,10 48,0 Q52,12 58,5 Q55,18 65,8 Q62,20 72,12 Q70,25 60,25Z" fill="#FF4D00" opacity="0.85" />
        <path d="M50,24 Q45,12 52,4 Q55,14 60,24Z" fill="#FFD700" opacity="0.8" />
        <text x="60" y="120" textAnchor="middle" fill="#FF2200" fontSize="14" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="2.5" stroke="white" strokeWidth="4" paintOrder="stroke">ON FIRE</text>
      </svg>
    </StickerWrap>
  );
}

// ── 14. COOKIES & CREAM — happy + cookie ──────────────────────────────────────
export function CookieSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={1.0}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="big-smile" />
        {/* Cookie top-left */}
        <circle cx="18" cy="18" r="13" fill="#C8860A" />
        <circle cx="18" cy="18" r="11" fill="#D4952C" />
        {/* Choc chips */}
        <circle cx="14" cy="14" r="2.5" fill="#5C2D0A" />
        <circle cx="22" cy="12" r="2" fill="#5C2D0A" />
        <circle cx="12" cy="22" r="2" fill="#5C2D0A" />
        <circle cx="22" cy="22" r="2.5" fill="#5C2D0A" />
        <circle cx="18" cy="18" r="1.5" fill="#5C2D0A" />
        {/* Cookie bite mark */}
        <path d="M28,10 Q34,4 34,18 Q28,14 28,10Z" fill="#070707" />
        <text x="60" y="120" textAnchor="middle" fill="#CC8800" fontSize="10" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="1.5" stroke="white" strokeWidth="3.5" paintOrder="stroke">COOKIES &amp; CREAM</text>
      </svg>
    </StickerWrap>
  );
}

// ── 15. NGMI — sad tears ─────────────────────────────────────────────────────
export function NgmiSticker({ size = 150 }: { size?: number }) {
  return (
    <StickerWrap delay={1.6} anim={{ y: [0, -6, 0] }}>
      <svg width={size} height={size} viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ShibaFace expression="sad" />
        {/* Rain drops */}
        <ellipse cx="30" cy="105" rx="2" ry="4" fill="#90CAF9" opacity="0.7" />
        <ellipse cx="50" cy="110" rx="2" ry="4" fill="#90CAF9" opacity="0.6" />
        <ellipse cx="70" cy="107" rx="2" ry="4" fill="#90CAF9" opacity="0.7" />
        <ellipse cx="90" cy="112" rx="2" ry="4" fill="#90CAF9" opacity="0.6" />
        <text x="60" y="122" textAnchor="middle" fill="#90CAF9" fontSize="16" fontWeight="900" fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing="3" stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke">NGMI</text>
      </svg>
    </StickerWrap>
  );
}
