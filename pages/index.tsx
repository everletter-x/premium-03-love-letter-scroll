import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useConfigLoader } from '../shared'

interface Config {
  recipient: string
  sender: string
  title: string
  message: string
  photos: string[]
  theme: string
  music: string
  musicTitle: string
  template: string
  captions: string[]
  closing: string
}

const themeColors: Record<string, { bg: string; text: string; accent: string; card: string }> = {
  pink: { bg: 'bg-pink-soft/10', text: 'text-dark-luxury', accent: 'text-rose', card: 'bg-pink-soft/20' },
  lavender: { bg: 'bg-lavender/10', text: 'text-dark-luxury', accent: 'text-purple-600', card: 'bg-lavender/20' },
  warm: { bg: 'bg-warm-white/20', text: 'text-dark-luxury', accent: 'text-gold-accent', card: 'bg-warm-white/30' },
  dark: { bg: 'bg-deep-black', text: 'text-elegant-white', accent: 'text-gold-accent', card: 'bg-dark-luxury/80' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  reduced: { opacity: 1, y: 0, transition: { duration: 0 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
  reduced: {},
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  reduced: { opacity: 1, scale: 1, transition: { duration: 0 } },
}

const letterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.02, duration: 0.3, ease: 'easeOut' },
  }),
}

function AnimatedSection({ children, className = '', prefersReducedMotion = false }: { children: React.ReactNode; className?: string; prefersReducedMotion?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const getVariants = () => {
    if (prefersReducedMotion) return fadeUp.reduced
    return isInView ? 'visible' : 'hidden'
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? getVariants() : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={letterVariant}
          custom={i}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

function MusicPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 py-3 min-h-[48px] hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2 transition-all duration-300 group"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 bg-rose rounded-full flex items-center justify-center shadow-md"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </motion.div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-dark-luxury">{title}</p>
          <p className="text-xs text-gray-500">{isPlaying ? 'Sedang diputar' : 'Ketuk untuk memutar'}</p>
        </div>
      </button>
      <audio ref={audioRef} src={src} preload="metadata" />
    </motion.div>
  )
}

export default function Home() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json')
  const [showContent, setShowContent] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (config) {
      setTimeout(() => setShowContent(true), prefersReducedMotion ? 0 : 300)
    }
  }, [config, prefersReducedMotion])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elegant-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-pink-soft border-t-rose rounded-full mx-auto mb-4"
          />
          <p className="text-dark-luxury/60">Memuat surat cintamu...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elegant-white">
        <p className="text-rose">Gagal memuat konfigurasi</p>
      </div>
    )
  }

  const colors = themeColors[config.theme] || themeColors.pink
  const paragraphs = config.message.split('\n\n').filter(p => p.trim())
  const firstParagraph = paragraphs[0] || ''
  const middleParagraphs = paragraphs.slice(1, paragraphs.length - 1)
  const lastParagraph = paragraphs[paragraphs.length - 1] || ''

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} transition-colors duration-1000`}>
      <audio src={config.music} loop />

      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showContent ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <span className="text-gold-accent text-sm tracking-[0.3em] uppercase font-medium">
              Untuk {config.recipient}
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
            <TypewriterText text={config.title} className={colors.accent} />
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
            className="w-16 h-[2px] bg-gold-accent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 0.6 } : {}}
            transition={{ delay: 2, duration: 1 }}
            className="text-sm tracking-widest uppercase"
          >
            Scroll ke bawah untuk membuka
          </motion.p>

          <motion.div
            animate={showContent ? { y: [0, 10, 0] } : {}}
            transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
            className="mt-4"
          >
            <svg className="w-6 h-6 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <AnimatedSection className="max-w-2xl text-center" prefersReducedMotion={prefersReducedMotion}>
          <div className="relative">
            <div className="absolute -top-8 -left-4 text-6xl text-gold-accent/20 font-serif">&ldquo;</div>
            <p className="text-lg sm:text-xl leading-relaxed italic text-dark-luxury/80">
              {firstParagraph}
            </p>
            <div className="absolute -bottom-8 -right-4 text-6xl text-gold-accent/20 font-serif">&rdquo;</div>
          </div>
        </AnimatedSection>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <AnimatedSection className="max-w-4xl w-full" prefersReducedMotion={prefersReducedMotion}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.photos.map((photo, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className={`relative overflow-hidden rounded-2xl shadow-lg ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-soft/30 to-lavender/30 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-rose/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-dark-luxury/50">Foto {index + 1}</p>
                  </div>
                </div>
                {config.captions[index] && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{config.captions[index]}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <AnimatedSection className="max-w-2xl" prefersReducedMotion={prefersReducedMotion}>
          <div className="space-y-12">
            <div className="text-center mb-16">
              <span className="text-gold-accent text-xs tracking-[0.4em] uppercase">Alasan Aku Sayang Kamu</span>
            </div>
            {middleParagraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`${colors.card} backdrop-blur-sm rounded-3xl p-8 shadow-sm`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-3xl font-bold ${colors.accent} opacity-30`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base sm:text-lg leading-relaxed flex-1">{paragraph}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <AnimatedSection className="max-w-3xl text-center" prefersReducedMotion={prefersReducedMotion}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gold-accent/10 rounded-full blur-3xl" />
              <svg className="w-16 h-16 mx-auto relative text-gold-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed italic text-dark-luxury/70">
              {lastParagraph}
            </p>
            <div className="mt-8 w-12 h-[1px] bg-gold-accent mx-auto" />
          </motion.div>
        </AnimatedSection>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <AnimatedSection className="max-w-2xl text-center" prefersReducedMotion={prefersReducedMotion}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="w-24 h-[1px] bg-gold-accent/40 mx-auto" />

            <p className="text-xl sm:text-2xl leading-relaxed text-dark-luxury/80">
              {config.closing}
            </p>

            <div className="pt-8">
              <p className="text-sm text-dark-luxury/40 tracking-widest uppercase mb-2">Dengan penuh cinta</p>
              <p className="text-3xl sm:text-4xl font-bold text-rose">{config.sender}</p>
            </div>

            <div className="pt-12">
              <svg className="w-8 h-8 mx-auto text-gold-accent/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      <MusicPlayer src={config.music} title={config.musicTitle} />

      {/* Pricing Section */}
      <div className="fixed bottom-20 right-6 z-50 bg-dark-luxury/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <p className="text-elegant-white/60 text-xs mb-1">Mulai dari</p>
        <p className="text-2xl font-bold text-gold-accent">Rp 75K</p>
      </div>

      <a
        href="https://wa.me/6282320114535?text=Halo%2C%20saya%20tertarik%20dengan%20EverLetter!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Pesan Sekarang
      </a>

      {/* Share Button */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: 'EverLetter - Eterna',
              text: 'Lihat hadiah digital indah ini!',
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link disalin ke clipboard!');
          }
        }}
        className="fixed bottom-6 left-6 z-50 bg-dark-luxury/20 backdrop-blur-sm text-dark-luxury px-4 py-3 rounded-full shadow-lg hover:bg-dark-luxury/30 transition-colors flex items-center gap-2"
        aria-label="Bagikan"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    </div>
  )
}
