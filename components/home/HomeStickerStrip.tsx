'use client';

import { motion } from 'framer-motion';
import {
  MoonSticker, RocketSticker, CookieSticker,
  IceCreamSticker, FireSticker, NakaGoSticker, DiamondHandsSticker, KimonoSticker
} from '@/components/shared/AnimatedStickers';

const stickers = [
  { component: NakaGoSticker, size: 160, label: 'Naka Go', delay: 0 },
  { component: KimonoSticker, size: 160, label: 'Born 1948', delay: 0.08 },
  { component: MoonSticker, size: 140, label: 'To The Moon', delay: 0.16 },
  { component: RocketSticker, size: 140, label: 'Launch', delay: 0.24 },
  { component: CookieSticker, size: 130, label: 'Pass the Cookie', delay: 0.32 },
  { component: IceCreamSticker, size: 130, label: 'Sweet Gains', delay: 0.4 },
  { component: FireSticker, size: 120, label: 'On Fire', delay: 0.48 },
  { component: DiamondHandsSticker, size: 130, label: 'Diamond Hands', delay: 0.56 },
];

export default function HomeStickerStrip() {
  return (
    <section className="py-20 overflow-hidden bg-[#0a0a0a] relative">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.04) 0%, transparent 70%)' }}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 relative z-10"
      >
        <span
          className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.4em] mb-3 block"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          Naka Go Sticker Pack
        </span>
        <h2
          className="text-5xl md:text-6xl text-white font-black leading-none"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            THE CULTURE
          </span>
        </h2>
        <p className="text-white/30 text-sm mt-3">Hover to interact. Screenshot. Share. Spread the legacy.</p>
      </motion.div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12">
          {stickers.map(({ component: Sticker, size, label, delay }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay, type: 'spring', damping: 16, stiffness: 200 }}
              className="text-center flex flex-col items-center"
            >
              <Sticker size={size} />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.3 }}
                className="text-white/40 text-xs mt-3 font-bold uppercase tracking-widest"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.2em' }}
              >
                {label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
