import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';
import { useConfigLoader } from '../shared';
import { RippleEffect } from '../components/RippleEffect';

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  captions: string[];
  closing: string;
  reasons?: string[];
}

const themeColors: Record<string, { bg: string; text: string; accent: string; accentHex: string; card: string; textMuted: string; dropCap: string }> = {
  warm: { 
    bg: 'bg-gradient-to-br from-[#12110F] via-[#1E1915] to-[#2B2118]', 
    text: 'text-[#FBFBF9]',
    accent: 'text-[#E6C29E]',
    accentHex: '#E6C29E',
    card: 'bg-white/[0.06] border-white/[0.12]',
    textMuted: 'text-[#E6C29E]/75',
    dropCap: 'text-[#E6C29E]',
  },
  pink: { 
    bg: 'bg-gradient-to-br from-[#0F0811] via-[#1A0B1A] to-[#250E20]', 
    text: 'text-[#F9F5F6]',
    accent: 'text-[#F6B3D0]',
    accentHex: '#F6B3D0',
    card: 'bg-white/[0.06] border-white/[0.12]',
    textMuted: 'text-[#F6B3D0]/75',
    dropCap: 'text-[#F6B3D0]',
  },
  lavender: { 
    bg: 'bg-gradient-to-br from-[#080711] via-[#0D0A1C] to-[#150F2A]', 
    text: 'text-[#F5F3F7]',
    accent: 'text-[#C5B3E6]',
    accentHex: '#C5B3E6',
    card: 'bg-white/[0.06] border-white/[0.12]',
    textMuted: 'text-[#C5B3E6]/75',
    dropCap: 'text-[#C5B3E6]',
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-12%' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

/* ── Gold Dust Rising Particles (unique to Eterna) ── */
function GoldDust({ color }: { color: string }) {
  const dust = useMemo(() =>
    [...Array(18)].map((_, i) => ({
      left: `${(i * 11 + 2) % 100}%`,
      size: 1 + (i % 4) * 0.5,
      duration: 5 + (i % 6) * 1.5,
      delay: (i % 8) * 0.7,
      drift: -15 + (i % 3) * 10,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {dust.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.left,
            bottom: "-5%",
            width: d.size,
            height: d.size,
            backgroundColor: color,
            boxShadow: `0 0 ${d.size * 4}px ${color}`,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, d.drift, -d.drift / 2, d.drift * 0.6],
            opacity: [0, 0.7, 0.4, 0],
            scale: [0.3, 1, 0.6, 0.2],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ── Ambient floating particles ── */
function AmbientParticles({ color, count = 8 }: { color: string; count?: number }) {
  const particles = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 10) % 100}%`,
      size: 1 + (i % 3),
      duration: 4 + (i % 5),
      delay: (i % 7) * 0.8,
    })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: color }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.35, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── 3D Parallax Section ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0, -1.5]);
  return (
    <motion.div className={className} style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}

/* ── Wax Seal Unsealing Animation ── */
function WaxSeal({ accentHex }: { accentHex: string }) {
  const [sealed, setSealed] = useState(true);

  return (
    <motion.div
      className="relative mx-auto mb-10 w-20 h-20 cursor-pointer"
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      onViewportEnter={() => {
        setTimeout(() => setSealed(false), 600);
      }}
    >
      {/* Wax seal circle */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 35%, #c0392b, #922b21)`,
          boxShadow: "0 4px 20px rgba(192, 57, 43, 0.3)",
        }}
        animate={sealed ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 4px 20px rgba(192, 57, 43, 0.3)",
            "0 4px 30px rgba(192, 57, 43, 0.5)",
            "0 4px 20px rgba(192, 57, 43, 0.3)",
          ],
        } : {
          scale: 0,
          opacity: 0,
          rotate: [0, 15, -10, 0],
        }}
        transition={sealed ? {
          duration: 2, repeat: Infinity, ease: "easeInOut",
        } : {
          duration: 0.8, ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* "E" emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/70 text-xl font-serif font-bold" style={{ fontFamily: "Playfair Display" }}>E</span>
        </div>
        {/* Wax drip detail */}
        <motion.div
          className="absolute -bottom-2 left-4 w-3 h-3 rounded-b-full"
          style={{ backgroundColor: "#c0392b" }}
          animate={sealed ? { y: [0, 2, 0] } : { y: 10, opacity: 0 }}
          transition={{ duration: 2, repeat: sealed ? Infinity : 0 }}
        />
        <motion.div
          className="absolute -bottom-1 right-6 w-2 h-2 rounded-b-full"
          style={{ backgroundColor: "#922b21" }}
          animate={sealed ? { y: [0, 1.5, 0] } : { y: 8, opacity: 0 }}
          transition={{ duration: 2.5, repeat: sealed ? Infinity : 0 }}
        />
      </motion.div>
      {/* Cracked pieces scatter */}
      {!sealed && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            backgroundColor: "#c0392b",
            top: "50%",
            left: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(i * 60 * Math.PI / 180) * (40 + i * 10),
            y: Math.sin(i * 60 * Math.PI / 180) * (40 + i * 10),
            opacity: 0,
            scale: 0.3,
            rotate: 360,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
      {/* Golden glow on unseal */}
      {!sealed && (
        <motion.div
          className="absolute inset-[-50%] rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0, 2, 3] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ background: `radial-gradient(circle, ${accentHex}, transparent)` }}
        />
      )}
    </motion.div>
  );
}

/* ── Character-by-Character Typewriter ── */
function TypewriterText({ text, className, startDelay = 1.5 }: { text: string; className?: string; startDelay?: number }) {
  const chars = text.split('');
  return (
    <div className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: startDelay + i * 0.04, duration: 0.1, ease: "easeOut" }}
          className="inline"
        >{char}</motion.span>
      ))}
    </div>
  )
}

/* ── Floating Background with parallax ── */
function FloatingBackground({ accentHex }: { accentHex: string }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div style={{ y: y1 }} className="absolute top-20 left-[10%] w-64 h-64 rounded-full blur-3xl opacity-5" />
      <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full blur-3xl opacity-5" />
      <motion.div style={{ y: y3 }} className="absolute bottom-20 left-[20%] w-72 h-72 rounded-full blur-3xl opacity-5" />
    </div>
  )
}

/* ── Music Player ── */
function MusicPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause()
      else audioRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }
  return (
    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 1, type: "spring" }} className="fixed bottom-8 right-8 z-50">
      <button onClick={togglePlay}
        className="w-14 h-14 bg-white/[0.08] backdrop-blur-xl shadow-glass-lg rounded-full flex items-center justify-center border border-white/[0.12] text-white cursor-pointer"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <div className="flex gap-[3px] items-center justify-center h-4">
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ duration: 1, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            <motion.div animate={{ height: [12, 6, 12] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            <motion.div animate={{ height: [6, 14, 6] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
          </div>
        ) : (
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      {title && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
          className="absolute bottom-full right-0 mb-3 whitespace-nowrap">
          <span className="text-[10px] tracking-wider text-white/30 uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.06]">{title}</span>
        </motion.div>
      )}
      <audio ref={audioRef} src={src} preload="metadata" loop />
    </motion.div>
  )
}

export default function Home() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json')

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border border-white/10 rounded-full mx-auto mb-4">
            <div className="w-full h-full border-t border-[#E6C29E]/50 rounded-full" />
          </motion.div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <div className="text-center">
          <p className="text-white/60 mb-4 font-display-premium">Gagal memuat konfigurasi</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors border border-white/10 cursor-pointer">Coba Lagi</button>
        </div>
      </div>
    )
  }

  const colors = themeColors[config.theme] || themeColors.pink
  const paragraphs = config.message.split('\n\n').filter(p => p.trim())
  const firstParagraph = paragraphs[0] || ''
  const middleParagraphs = paragraphs.slice(1, paragraphs.length - 1)
  const lastParagraph = paragraphs[paragraphs.length - 1] || ''

  return (
    <>
      <Head>
        <title>{config.title} - EverLetter</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>
      <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans selection:bg-white/20 relative`}>
        <RippleEffect color={`${colors.accentHex}15`} />
        <FloatingBackground accentHex={colors.accentHex} />
        
        {/* ═══ Intro Hero ═══ */}
        <section className="min-h-[110vh] flex flex-col items-center justify-center px-6 text-center relative z-10">
          <GoldDust color={colors.accentHex} />
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "80px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] mb-12" style={{ background: `linear-gradient(180deg, transparent, ${colors.accentHex}30)` }} />
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }}
            className={`text-[10px] uppercase font-semibold mb-8 tracking-[0.5em] ${colors.accent}`}>
            Surat Untuk {config.recipient}
          </motion.p>

          <h1 className="font-serif-premium text-4xl md:text-6xl lg:text-7xl font-light mb-12 leading-tight px-4 max-w-5xl mx-auto">
            <TypewriterText text={config.title} />
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }}
            className="flex flex-col items-center gap-4 mt-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25">Mulai Membaca</p>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <div className="w-[1px] h-12" style={{ background: `linear-gradient(180deg, ${colors.accentHex}30, transparent)` }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ First Letter with Drop Cap ═══ */}
        <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10">
          <GoldDust color={colors.accentHex} />
          <ParallaxSection speed={0.12} className="max-w-3xl mx-auto w-full">
            <AnimatedSection>
              <div className={`relative p-8 md:p-16 ${colors.card} border backdrop-blur-[32px] rounded-[24px] shadow-glass-lg`}>
                <WaxSeal accentHex={colors.accentHex} />
                <div className="flex gap-1.5 mb-8 opacity-25">
                  <div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <p className="font-display-premium text-xl md:text-2xl leading-[1.9] font-light text-white/85">
                  <span className="float-left text-7xl md:text-8xl font-serif-premium leading-[0.8] mr-4 mt-2" style={{ color: colors.accentHex }}>
                    {firstParagraph.charAt(0)}
                  </span>
                  {firstParagraph.substring(1)}
                </p>
              </div>
            </AnimatedSection>
          </ParallaxSection>
        </section>

        {/* ═══ Emotional Depth Section ═══ */}
        <section className="min-h-screen py-32 px-6 relative z-10">
          <GoldDust color={colors.accentHex} />
          <ParallaxSection speed={0.1} className="max-w-2xl mx-auto">
            <AnimatedSection className="mb-16 text-center">
              <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold ${colors.accent}`}>
                Perasaanku
              </p>
              <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
                Tentang Waktu
              </h2>
              <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
            </AnimatedSection>

            <div className="space-y-12">
              {[
                "Waktu mengajarkanku bahwa cinta sejati bukan tentang kilatan momen yang dramatis, tapi tentang ketekunan dalam hal-hal kecil yang kita lakukan setiap hari. Ia tentang bagaimana kita bangun di pagi hari dan memilih satu sama lain, lagi dan lagi, tanpa keraguan.",
                "Ada keindahan dalam kebersamaan yang tak terucap. Dalam diam yang nyaman, dalam tawa yang tumpah tanpa perlu alasan, dalam sentuhan yang mengatakan \"aku di sini\" tanpa perlu kata-kata. Kita telah membangun dunia kita sendiri — dunia di mana waktu berhenti saat kita bersama.",
                "Aku merenungkan tentang bagaimana kita telah melewati badai bersama — bukan tanpa luka, bukan tanpa air mata, tapi selalu dengan tangan yang tergenggam erat. Kita belajar bahwa cinta bukan tentang tidak pernah jatuh, tapi tentang selalu bangun bersama.",
                "Dan ketika aku melihat ke belakang, aku tidak menyesali satu momen pun. Setiap tawa, setiap tangis, setiap pertengkaran kecil yang berakhir dengan pelukan — semuanya telah membawa kita ke sini, ke tempat yang lebih indah dari yang pernah kubayangkan.",
              ].map((text, i) => (
                <AnimatedSection key={i}>
                  <p className="font-display-premium text-lg md:text-xl text-white/75 leading-[2] font-light">
                    {text}
                  </p>
                  {i < 3 && (
                    <div className="flex justify-center mt-10">
                      <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
                    </div>
                  )}
                </AnimatedSection>
              ))}
            </div>
          </ParallaxSection>
        </section>

        {/* ═══ Photo Gallery - Offset Cinematic Grid ═══ */}
        {config.photos?.length > 0 && (
          <section className="py-32 px-6 relative z-10">
            <GoldDust color={colors.accentHex} />
            <div className="max-w-6xl mx-auto">
              <AnimatedSection className="mb-24 text-center">
                <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold ${colors.accent}`}>Gallery</p>
                <h2 className="font-serif-premium text-3xl font-light tracking-wide">Kenangan Bersama</h2>
                <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
              </AnimatedSection>
              
              <div className="flex flex-col gap-32">
                {config.photos.map((photo, i) => (
                  <AnimatedSection key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                    <ParallaxSection speed={0.08} className="w-full md:w-1/2">
                      <div className="aspect-[4/5] relative overflow-hidden rounded-[20px] shadow-2xl border border-white/[0.08] bg-white/[0.02] group cursor-pointer">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full h-full">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full h-full"
                            style={{ willChange: 'transform' }}
                          >
                            <img src={`/${photo}`} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          </motion.div>
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                          style={{ background: `radial-gradient(circle at 50% 50%, ${colors.accentHex}15, transparent 70%)` }}
                        />
                      </div>
                    </ParallaxSection>
                    {config.captions?.[i] && (
                      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <p className="font-display-premium text-xl md:text-2xl font-light italic text-center leading-[1.8] text-white/75">&ldquo;{config.captions[i]}&rdquo;</p>
                      </div>
                    )}
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ Reasons Section ═══ */}
        {config.reasons && config.reasons.length > 0 && (
          <section className="py-32 px-6 relative z-10">
            <GoldDust color={colors.accentHex} />
            <ParallaxSection speed={0.1} className="max-w-4xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold ${colors.accent}`}>Alasan</p>
                <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">Mengapa Kau Spesial</h2>
                <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.reasons.map((reason, i) => (
                  <AnimatedSection key={i}>
                    <motion.div
                      className={`p-8 ${colors.card} border rounded-[20px] backdrop-blur-[32px] shadow-glass-lg relative overflow-hidden`}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${colors.accentHex}, transparent)` }} />
                      <span className="font-serif-premium text-4xl font-bold block mb-4" style={{ color: `${colors.accentHex}30` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display-premium text-base md:text-lg text-white/80 leading-relaxed font-light">{reason}</p>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </ParallaxSection>
          </section>
        )}

        {/* ═══ Middle Body Sections ═══ */}
        {middleParagraphs.length > 0 && (
          <section className="py-32 px-6 relative z-10">
            <GoldDust color={colors.accentHex} />
            <div className="max-w-2xl mx-auto space-y-32">
              {middleParagraphs.map((para, i) => (
                <ParallaxSection key={i} speed={0.08}>
                  <AnimatedSection>
                    <div className={`p-10 md:p-16 ${colors.card} backdrop-blur-[24px] border rounded-2xl shadow-glass-lg relative`}>
                      <span className={`absolute -top-6 left-10 text-5xl font-mono ${colors.dropCap} font-bold opacity-25`}>
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="font-display-premium text-lg md:text-xl leading-[1.9] font-light">{para}</p>
                    </div>
                  </AnimatedSection>
                </ParallaxSection>
              ))}
            </div>
          </section>
        )}

        {/* ═══ Last Paragraph with Cinematic Emphasis ═══ */}
        <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10">
          <GoldDust color={colors.accentHex} />
          <ParallaxSection speed={0.1}>
            <AnimatedSection className="max-w-4xl text-center">
              <p className={`font-serif-premium text-2xl md:text-4xl italic leading-snug ${colors.accent}`}>{lastParagraph}</p>
              <div className="w-16 h-[2px] mx-auto mt-16" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
            </AnimatedSection>
          </ParallaxSection>
        </section>

        {/* ═══ Closing Signature ═══ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32 relative z-10 text-center">
          <GoldDust color={colors.accentHex} />
          <ParallaxSection speed={0.08}>
            <AnimatedSection>
              <motion.div
                className="w-16 h-16 mx-auto mb-12 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <motion.svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.accentHex }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              </motion.div>
              <p className={`font-display-premium text-xl md:text-2xl font-light mb-16 text-white/75`}>{config.closing}</p>
              <div className="w-8 h-[1px] mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
              <p className={`text-[10px] tracking-[0.4em] uppercase mb-6 text-white/25`}>Yours Truly,</p>
              <p className="font-serif-premium text-3xl md:text-5xl font-light">{config.sender}</p>
            </AnimatedSection>
          </ParallaxSection>
        </section>

        {config.music && <MusicPlayer src={`/${config.music}`} title={config.musicTitle} />}
      </div>
    </>
  )
}
