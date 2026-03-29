'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SPOTIFY_EMBED } from '@/lib/utils/constants';

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const BAR_COUNT = 20;

export default function HomeDdergo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(29,185,84,0.06) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span
            className="text-[#1DB954] text-sm font-black uppercase tracking-[0.3em] mb-3 block"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            The Sound of the Pack
          </span>
          <h2
            className="text-5xl md:text-6xl font-black text-white leading-none mb-3"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #1DB954, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>DDERGO</span> VIBES
          </h2>
          <p className="text-white/40 text-sm">The official $NAKA playlist. Vibe with the pack.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Spotify Embed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 rounded-3xl overflow-hidden"
            style={{ border: '1px solid rgba(29,185,84,0.2)', minHeight: 352 }}
          >
            <iframe
              src={SPOTIFY_EMBED}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ border: 'none', display: 'block' }}
              title="Ddergo Playlist"
            />
          </motion.div>

          {/* Side card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-72 rounded-3xl p-7 flex flex-col gap-6"
            style={{ background: '#111', border: '1px solid rgba(29,185,84,0.15)' }}
          >
            {/* Animated icon */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: playing ? [0, 360] : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#1DB954' }}
              >
                <SpotifyIcon />
              </motion.div>
              <div>
                <div
                  className="text-white font-black text-base"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
                >
                  DDERGO
                </div>
                <div className="text-white/40 text-xs">Official Naka Go Playlist</div>
              </div>
            </div>

            {/* Animated bars */}
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: BAR_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ background: '#1DB954', minWidth: 3 }}
                  animate={{ height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 80}%`, `${20 + Math.random() * 40}%`] }}
                  transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.04, repeatType: 'reverse' }}
                />
              ))}
            </div>

            <div className="space-y-2">
              {['🎵 Curated by the cult', '🐕 Shiba-approved vibes', '🔥 Updated regularly', '🌕 For moon nights'].map((item) => (
                <div key={item} className="text-white/50 text-xs flex items-center gap-2">{item}</div>
              ))}
            </div>

            <Link href="/ddergo">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-full text-center text-sm font-black cursor-pointer"
                style={{
                  background: '#1DB954',
                  color: 'black',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.1em',
                }}
              >
                FULL DDERGO EXPERIENCE
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
