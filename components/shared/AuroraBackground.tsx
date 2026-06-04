'use client';

/**
 * Drifting aurora field rendered behind the whole app. Pure transform-based
 * CSS animation (GPU-friendly), fixed behind content, and fully disabled under
 * prefers-reduced-motion via the global stylesheet. Blob count is trimmed on
 * small screens so it never costs framerate on mobile.
 */

interface Blob {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  mobile: boolean;
}

const BLOBS: Blob[] = [
  { color: 'rgba(255,77,0,0.22)', size: 520, top: '-8%', left: '-6%', duration: 22, delay: 0, mobile: true },
  { color: 'rgba(255,0,0,0.14)', size: 440, top: '18%', left: '62%', duration: 26, delay: -6, mobile: true },
  { color: 'rgba(255,215,0,0.10)', size: 380, top: '58%', left: '8%', duration: 30, delay: -12, mobile: false },
  { color: 'rgba(155,48,255,0.12)', size: 460, top: '68%', left: '58%', duration: 28, delay: -3, mobile: false },
];

export default function AuroraBackground() {
  return (
    <div aria-hidden className="aurora-field" style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#070707' }} />
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`aurora-blob animate-orb-float ${blob.mobile ? '' : 'hidden sm:block'}`}
          style={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animationDuration: `${blob.duration}s`,
            animationDelay: `${blob.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
      {/* fine grain + vignette for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          mixBlendMode: 'overlay',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  );
}
