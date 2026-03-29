'use client';

import { motion } from 'framer-motion';

// ─── MOON STICKER ─────────────────────────────────────────────────────────────
export function MoonSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: 5 }}
      animate={{ y: [0, -14, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="moonFace" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF5C0"/>
            <stop offset="100%" stopColor="#FFD700"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#moonGlow)"/>
        <circle cx="100" cy="100" r="70" fill="url(#moonFace)" stroke="#FFD700" strokeWidth="2"/>
        <circle cx="75" cy="80" r="8" fill="#F0CC00" opacity="0.6"/>
        <circle cx="125" cy="95" r="5" fill="#F0CC00" opacity="0.5"/>
        <circle cx="90" cy="118" r="10" fill="#F0CC00" opacity="0.5"/>
        <ellipse cx="82" cy="70" rx="10" ry="14" fill="#C8A000" transform="rotate(-15 82 70)"/>
        <ellipse cx="82" cy="70" rx="6" ry="9" fill="#FF8C00" opacity="0.6" transform="rotate(-15 82 70)"/>
        <ellipse cx="118" cy="70" rx="10" ry="14" fill="#C8A000" transform="rotate(15 118 70)"/>
        <ellipse cx="118" cy="70" rx="6" ry="9" fill="#FF8C00" opacity="0.6" transform="rotate(15 118 70)"/>
        <ellipse cx="100" cy="98" rx="28" ry="26" fill="#D4A800"/>
        <ellipse cx="91" cy="94" rx="5" ry="6" fill="#1a1a1a"/>
        <circle cx="93" cy="92" r="1.5" fill="white"/>
        <ellipse cx="109" cy="94" rx="5" ry="6" fill="#1a1a1a"/>
        <circle cx="111" cy="92" r="1.5" fill="white"/>
        <ellipse cx="100" cy="105" rx="12" ry="9" fill="#C09000"/>
        <ellipse cx="100" cy="102" rx="5" ry="3" fill="#FF6B35"/>
        <ellipse cx="100" cy="103" rx="3" ry="2" fill="#1a1a1a"/>
        <path d="M93 110 Q100 116 107 110" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="83" cy="106" r="5" fill="#FF9090" opacity="0.7"/>
        <circle cx="117" cy="106" r="5" fill="#FF9090" opacity="0.7"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <text
            key={i}
            x={100 + 85 * Math.cos((deg * Math.PI) / 180) - 4}
            y={100 + 85 * Math.sin((deg * Math.PI) / 180) + 4}
            fontSize="10"
            fill="#FFD700"
            opacity="0.7"
          >★</text>
        ))}
      </svg>
    </motion.div>
  );
}

// ─── ROCKET STICKER ───────────────────────────────────────────────────────────
export function RocketSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: -10 }}
      animate={{ y: [0, -18, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <linearGradient id="rocketBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#FF0000"/>
          </linearGradient>
          <linearGradient id="flame1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#FF000000"/>
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="155" rx="18" ry="28" fill="url(#flame1)" opacity="0.9"/>
        <ellipse cx="100" cy="162" rx="10" ry="18" fill="#FFF" opacity="0.7"/>
        <rect x="82" y="80" width="36" height="65" rx="18" fill="url(#rocketBody)"/>
        <path d="M82 82 Q100 40 118 82 Z" fill="#FF4D00"/>
        <circle cx="100" cy="102" r="14" fill="#001133" stroke="#ffffff30" strokeWidth="2"/>
        <ellipse cx="100" cy="104" rx="10" ry="9" fill="#D4A800"/>
        <ellipse cx="96" cy="100" rx="3" ry="3.5" fill="#1a1a1a"/>
        <circle cx="97" cy="99" r="1" fill="white"/>
        <ellipse cx="104" cy="100" rx="3" ry="3.5" fill="#1a1a1a"/>
        <circle cx="105" cy="99" r="1" fill="white"/>
        <ellipse cx="100" cy="107" rx="4" ry="3" fill="#C09000"/>
        <ellipse cx="100" cy="105" rx="2" ry="1.5" fill="#FF6B35"/>
        <circle cx="94" cy="107" r="2.5" fill="#FF9090" opacity="0.6"/>
        <circle cx="106" cy="107" r="2.5" fill="#FF9090" opacity="0.6"/>
        <path d="M82 130 L64 148 L82 142 Z" fill="#CC3300"/>
        <path d="M118 130 L136 148 L118 142 Z" fill="#CC3300"/>
        {[[30,40],[165,55],[25,110],[170,120]].map(([x,y], i) => (
          <text key={i} x={x} y={y} fontSize={i % 2 === 0 ? "14" : "10"} fill="#FFD700" opacity="0.8">✦</text>
        ))}
        <text x="100" y="190" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FFD700" fontFamily="sans-serif">TO THE MOON 🌕</text>
      </svg>
    </motion.div>
  );
}

// ─── COOKIE STICKER ───────────────────────────────────────────────────────────
export function CookieSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: -8 }}
      animate={{ rotate: [0, 8, -8, 0], y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id="cookieFill" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#D4822A"/>
            <stop offset="100%" stopColor="#A0521A"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="98" r="72" fill="url(#cookieFill)"/>
        <circle cx="152" cy="52" r="30" fill="#0a0a0a"/>
        <circle cx="100" cy="98" r="72" fill="none" stroke="#8B4513" strokeWidth="3" opacity="0.4"/>
        {[[80,75],[110,80],[90,105],[120,100],[70,115],[105,120],[135,85],[75,90],[115,130],[88,135]].map(([cx,cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="7" ry="5" fill="#3B1C00" transform={`rotate(${i * 36} ${cx} ${cy})`}/>
        ))}
        <text x="95" y="102" textAnchor="middle" fontSize="16" fontWeight="900" fill="#FFD700" fontFamily="Impact, sans-serif">$NAKA</text>
        {[[148,30],[168,45],[158,22],[175,35]].map(([x,y], i) => (
          <text key={i} x={x} y={y} fontSize="12" fill="#FFD700" opacity="0.8">✦</text>
        ))}
        <text x="100" y="188" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#D4822A" fontFamily="sans-serif">🍪 PASS IT ON 🍪</text>
      </svg>
    </motion.div>
  );
}

// ─── ICE CREAM STICKER ────────────────────────────────────────────────────────
export function IceCreamSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 220" width={size} height={size}>
        <defs>
          <linearGradient id="iceConeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4822A"/>
            <stop offset="100%" stopColor="#8B4513"/>
          </linearGradient>
          <radialGradient id="scoopGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFB3BA"/>
            <stop offset="100%" stopColor="#FF6B7A"/>
          </radialGradient>
          <radialGradient id="scoop2Grad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#B5E8B0"/>
            <stop offset="100%" stopColor="#5ABF50"/>
          </radialGradient>
        </defs>
        <path d="M70 130 L100 195 L130 130 Z" fill="url(#iceConeGrad)"/>
        <line x1="100" y1="130" x2="85" y2="175" stroke="#8B4513" strokeWidth="1.5" opacity="0.5"/>
        <line x1="100" y1="130" x2="115" y2="175" stroke="#8B4513" strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="100" cy="118" rx="32" ry="30" fill="url(#scoopGrad)"/>
        <ellipse cx="100" cy="88" rx="28" ry="27" fill="url(#scoop2Grad)"/>
        {[[85,105],[110,108],[95,115],[115,100],[82,98]].map(([x,y], i) => (
          <rect key={i} x={x} y={y} width="8" height="3" rx="1.5" fill={['#FF4D00','#FFD700','#00FFCC','#FF88FF','#88FFFF'][i]} transform={`rotate(${i*35 - 20} ${x+4} ${y+1.5})`}/>
        ))}
        <circle cx="100" cy="62" r="10" fill="#CC0000"/>
        <path d="M100 62 Q108 45 115 40" stroke="#228B22" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="115" cy="39" rx="5" ry="3" fill="#228B22"/>
        <text x="100" y="215" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF6B7A" fontFamily="sans-serif">🍦 SWEET GAINS 🍦</text>
      </svg>
    </motion.div>
  );
}

// ─── FIRE STICKER ─────────────────────────────────────────────────────────────
export function FireSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.6, repeat: Infinity }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 220" width={size} height={size}>
        <defs>
          <radialGradient id="fireCore" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#FFF700"/>
            <stop offset="40%" stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#FF0000"/>
          </radialGradient>
        </defs>
        <path d="M100 30 Q130 60 140 90 Q155 130 140 155 Q125 180 100 185 Q75 180 60 155 Q45 130 60 90 Q70 60 100 30" fill="url(#fireCore)"/>
        <path d="M100 65 Q115 85 122 110 Q128 135 115 152 Q108 162 100 163 Q92 162 85 152 Q72 135 78 110 Q85 85 100 65" fill="#FFD700"/>
        <ellipse cx="100" cy="140" rx="12" ry="16" fill="white" opacity="0.85"/>
        <ellipse cx="91" cy="128" rx="5" ry="6" fill="#1a0000"/>
        <ellipse cx="109" cy="128" rx="5" ry="6" fill="#1a0000"/>
        <circle cx="92.5" cy="126.5" r="1.5" fill="white"/>
        <circle cx="110.5" cy="126.5" r="1.5" fill="white"/>
        <path d="M93 138 Q100 143 107 138" stroke="#1a0000" strokeWidth="1.5" fill="none"/>
        <text x="100" y="210" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FF4D00" fontFamily="Impact, sans-serif">FIRE 🔥</text>
      </svg>
    </motion.div>
  );
}

// ─── NAKA GO MAIN STICKER ─────────────────────────────────────────────────────
export function NakaGoSticker({ size = 200 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: 3 }}
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 240 260" width={size} height={size}>
        <defs>
          <radialGradient id="nakaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#FF4D00" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="nakaBody" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#D4A800"/>
            <stop offset="100%" stopColor="#A07800"/>
          </radialGradient>
          <radialGradient id="medalGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFE066"/>
            <stop offset="100%" stopColor="#CC8800"/>
          </radialGradient>
        </defs>
        <circle cx="120" cy="120" r="110" fill="url(#nakaGlow)"/>
        <ellipse cx="120" cy="175" rx="50" ry="35" fill="#A07800" opacity="0.6"/>
        <path d="M160 150 Q195 125 185 105 Q175 90 165 105 Q160 120 160 150" fill="#D4A800"/>
        <ellipse cx="90" cy="75" rx="18" ry="26" fill="#B88C00" transform="rotate(-10 90 75)"/>
        <ellipse cx="90" cy="75" rx="10" ry="16" fill="#FF8C00" opacity="0.7" transform="rotate(-10 90 75)"/>
        <ellipse cx="150" cy="75" rx="18" ry="26" fill="#B88C00" transform="rotate(10 150 75)"/>
        <ellipse cx="150" cy="75" rx="10" ry="16" fill="#FF8C00" opacity="0.7" transform="rotate(10 150 75)"/>
        <ellipse cx="120" cy="115" rx="46" ry="44" fill="url(#nakaBody)"/>
        <ellipse cx="120" cy="125" rx="28" ry="22" fill="#C8A800" opacity="0.8"/>
        <ellipse cx="106" cy="108" rx="8" ry="9" fill="#1a1a1a"/>
        <circle cx="109" cy="105.5" r="2.5" fill="white"/>
        <ellipse cx="134" cy="108" rx="8" ry="9" fill="#1a1a1a"/>
        <circle cx="137" cy="105.5" r="2.5" fill="white"/>
        <ellipse cx="120" cy="122" rx="18" ry="13" fill="#B89800"/>
        <ellipse cx="120" cy="118" rx="8" ry="5" fill="#FF6B35"/>
        <ellipse cx="120" cy="119" rx="5" ry="3.5" fill="#1a1a1a"/>
        <path d="M109 128 Q120 137 131 128" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="96" cy="120" r="8" fill="#FF9090" opacity="0.6"/>
        <circle cx="144" cy="120" r="8" fill="#FF9090" opacity="0.6"/>
        <ellipse cx="88" cy="165" rx="18" ry="14" fill="#C8A800"/>
        <ellipse cx="152" cy="165" rx="18" ry="14" fill="#C8A800"/>
        <circle cx="120" cy="148" r="14" fill="url(#medalGrad)" stroke="#CC8800" strokeWidth="1.5"/>
        <text x="120" y="153" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B5E00" fontFamily="sans-serif">中</text>
        <path d="M112 135 L116 148 M128 135 L124 148" stroke="#FF4D00" strokeWidth="3" strokeLinecap="round"/>
        <text x="120" y="222" textAnchor="middle" fontSize="22" fontWeight="900" fill="#FF4D00" fontFamily="Impact, sans-serif">NAKA GO</text>
        <text x="120" y="240" textAnchor="middle" fontSize="14" fill="#FFD700" fontFamily="sans-serif">中号</text>
      </svg>
    </motion.div>
  );
}

// ─── DIAMOND HANDS STICKER ────────────────────────────────────────────────────
export function DiamondHandsSticker({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      animate={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <linearGradient id="diamondGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8EDFF"/>
            <stop offset="30%" stopColor="#5BC8FF"/>
            <stop offset="60%" stopColor="#0099FF"/>
            <stop offset="100%" stopColor="#0055CC"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="90" r="55" fill="none" stroke="#5BC8FF" strokeWidth="3" opacity="0.3"/>
        <polygon points="100,35 145,80 100,140 55,80" fill="url(#diamondGrad)" stroke="#A8EDFF" strokeWidth="1.5"/>
        <polygon points="100,35 145,80 100,80" fill="#5BC8FF" opacity="0.5"/>
        <polygon points="100,35 55,80 100,80" fill="#A8EDFF" opacity="0.4"/>
        <polygon points="100,140 145,80 100,80" fill="#0055CC" opacity="0.6"/>
        <polygon points="100,140 55,80 100,80" fill="#0077EE" opacity="0.5"/>
        <polygon points="100,35 120,65 100,80 80,65" fill="white" opacity="0.4"/>
        {[[100,20],[150,60],[50,60],[100,155],[160,90],[40,90]].map(([x,y], i) => (
          <text key={i} x={x-5} y={y} fontSize={i % 3 === 0 ? "14" : "10"} fill="#A8EDFF" opacity="0.8">✦</text>
        ))}
        <ellipse cx="75" cy="145" rx="22" ry="18" fill="#D4A800" transform="rotate(-15 75 145)"/>
        <ellipse cx="125" cy="145" rx="22" ry="18" fill="#D4A800" transform="rotate(15 125 145)"/>
        <text x="100" y="185" textAnchor="middle" fontSize="20" fontWeight="900" fill="#5BC8FF" fontFamily="Impact, sans-serif">HODL 💎</text>
      </svg>
    </motion.div>
  );
}

// ─── KIMONO STICKER ───────────────────────────────────────────────────────────
export function KimonoSticker({ size = 200 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      animate={{ y: [0, -12, 0], rotate: [0, 1, -1, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 220 260" width={size} height={size}>
        <defs>
          <linearGradient id="kimonoRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CC0000"/>
            <stop offset="100%" stopColor="#880000"/>
          </linearGradient>
          <radialGradient id="kimonoHead" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#D4A800"/>
            <stop offset="100%" stopColor="#A07800"/>
          </radialGradient>
        </defs>
        <path d="M55 160 Q50 200 55 240 L165 240 Q170 200 165 160 Q155 145 140 140 L110 150 L80 140 Q65 145 55 160 Z" fill="url(#kimonoRed)"/>
        {[[70,175],[100,170],[130,175],[85,195],[115,195],[70,215],[100,210],[130,215]].map(([x,y], i) => (
          <text key={i} x={x} y={y} fontSize="12" fill="#FFD700" opacity="0.4" fontFamily="sans-serif">✿</text>
        ))}
        <path d="M90 140 L110 155 L130 140" stroke="#FFD700" strokeWidth="3" fill="none"/>
        <rect x="58" y="188" width="104" height="18" rx="4" fill="#FFD700" opacity="0.8"/>
        <text x="110" y="201" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#CC0000" fontFamily="sans-serif">中号</text>
        <path d="M55 160 Q30 165 25 185 Q30 200 50 195 Q55 180 65 175 Z" fill="url(#kimonoRed)"/>
        <path d="M165 160 Q190 165 195 185 Q190 200 170 195 Q165 180 155 175 Z" fill="url(#kimonoRed)"/>
        <ellipse cx="35" cy="192" rx="14" ry="11" fill="#C8A800"/>
        <ellipse cx="185" cy="192" rx="14" ry="11" fill="#C8A800"/>
        <rect x="100" y="127" width="20" height="15" rx="5" fill="#C8A800"/>
        <ellipse cx="110" cy="110" rx="42" ry="40" fill="url(#kimonoHead)"/>
        <ellipse cx="82" cy="80" rx="16" ry="22" fill="#A07800" transform="rotate(-12 82 80)"/>
        <ellipse cx="82" cy="80" rx="9" ry="14" fill="#FF8C00" opacity="0.6" transform="rotate(-12 82 80)"/>
        <ellipse cx="138" cy="80" rx="16" ry="22" fill="#A07800" transform="rotate(12 138 80)"/>
        <ellipse cx="138" cy="80" rx="9" ry="14" fill="#FF8C00" opacity="0.6" transform="rotate(12 138 80)"/>
        <ellipse cx="110" cy="120" rx="26" ry="20" fill="#C09800"/>
        <ellipse cx="98" cy="105" rx="7" ry="8" fill="#1a1a1a"/>
        <circle cx="100.5" cy="103" r="2" fill="white"/>
        <ellipse cx="122" cy="105" rx="7" ry="8" fill="#1a1a1a"/>
        <circle cx="124.5" cy="103" r="2" fill="white"/>
        <ellipse cx="110" cy="116" rx="7" ry="5" fill="#FF6B35"/>
        <ellipse cx="110" cy="117" rx="4" ry="3" fill="#1a1a1a"/>
        <path d="M101 124 Q110 130 119 124" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="89" cy="116" r="7" fill="#FF9090" opacity="0.6"/>
        <circle cx="131" cy="116" r="7" fill="#FF9090" opacity="0.6"/>
        <ellipse cx="110" cy="73" rx="52" ry="12" fill="#D4A800" stroke="#B88C00" strokeWidth="1.5"/>
        <path d="M75 73 Q90 52 110 48 Q130 52 145 73" fill="#C8A000" stroke="#B88C00" strokeWidth="1.5"/>
        <circle cx="110" cy="50" r="4" fill="#FF4D00"/>
        {[[20,80],[195,75],[15,145],[200,150]].map(([x,y], i) => (
          <text key={i} x={x} y={y} fontSize="14" fill="#FFD700" opacity="0.7">✦</text>
        ))}
        <text x="110" y="258" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FF4D00" fontFamily="Impact, sans-serif">BORN 1948</text>
      </svg>
    </motion.div>
  );
}
