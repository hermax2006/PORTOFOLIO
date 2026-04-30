import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@hooks/useGSAP'
import styles from './WorkDev.module.css'

const PROJECTS_DEV = [
  {
    id: 1,
    title: 'TaskFlash',
    subtitle: 'App de gestion de tâches',
    stack: ['React', 'Laravel', 'API REST'],
    desc: 'Application full-stack de gestion de tâches avec authentification, tableau de bord et API Laravel. Interface React fluide connectée à un backend robuste.',
    year: '2024',
    status: 'live',
    link: 'https://taskflash-jzipxwkp2-hermax2006s-projects.vercel.app/login',
    github: null,
    color: '#4af0ff',
    bg: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  },
  {
    id: 2,
    title: 'CinémaInfo',
    subtitle: 'Plateforme cinéma',
    stack: ['HTML', 'CSS', 'JavaScript', 'API REST'],
    desc: "Site d'information cinéma avec recherche de films, fiches détaillées et intégration d'une API externe de données cinématographiques.",
    year: '2024',
    status: 'live',
    link: 'https://cinemainfo222.netlify.app',
    github: null,
    color: '#4af0ff',
    bg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
  {
    id: 3,
    title: 'Gestion Projet',
    subtitle: 'Dashboard agence',
    stack: ['React', 'PHP', 'Laravel', 'CSS'],
    desc: "Application de gestion de projets pour agence avec suivi des tâches, équipes et livraisons. Architecture frontend React + backend Laravel.",
    year: '2025',
    status: 'wip',
    link: null,
    github: 'https://github.com/hermax2006/gestion_projet',
    color: '#a78bfa',
    bg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  },
  {
    id: 4,
    title: 'Modelisation 3D',
    subtitle: 'Expérience WebGL',
    stack: ['Three.js', 'GSAP', 'WebGL'],
    desc: 'Expérience 3D interactive construite avec Three.js. Modèles, lumières et animations dans le navigateur.',
    year: '2024',
    status: 'live',
    link: 'https://symphonious-pasca-25222b.netlify.app',
    github: null,
    color: '#ff6b4a',
    bg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  },
]

export default function WorkDev() {
  const ref = useRef()

  useGSAP(({ gsap }) => {
    // Header
    gsap.from(`.${styles.eyebrow}`, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: `.${styles.header}`, start: 'top 88%' },
    })
    gsap.from(`.${styles.title}`, {
      y: 60, opacity: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: `.${styles.header}`, start: 'top 88%' },
    })
    gsap.from(`.${styles.subtitle}`, {
      y: 30, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: `.${styles.header}`, start: 'top 88%' },
    })

    // Cards slide-in alternés gauche/droite
    document.querySelectorAll(`.${styles.card}`).forEach((card, i) => {
      const fromLeft = i % 2 === 0
      gsap.from(card, {
        x: fromLeft ? -80 : 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      })
    })

    // Ligne de progression
    gsap.from(`.${styles.progressLine}`, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: `.${styles.cards}`,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    })
  }, [], { scope: ref })

  return (
    <section ref={ref} className={`${styles.page} page`}>

      {/* ── Header ─────────────────────────── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className="text-[var(--c-dev)] font-mono text-xs tracking-widest">// 01</span>
          <span className="text-[var(--c-text-3)] font-mono text-xs tracking-widest"> — Dev Web</span>
        </p>
        <h1 className={styles.title}>
          Projets<br />
          <span className={styles.titleGrad}>Web</span>
        </h1>
        <p className={styles.subtitle}>
          Interfaces, apps full-stack et expériences web construites avec
          React, Laravel et des APIs modernes.
        </p>
      </div>

      {/* ── Cards ──────────────────────────── */}
      <div className={styles.cards}>
        <div className={styles.progressLine} />

        {PROJECTS_DEV.map((p) => (
          <article key={p.id} className={styles.card}>

            {/* Image */}
            <div className={styles.cardImg}>
              <img src={p.bg} alt={p.title} loading="lazy" />
              <div className={styles.cardImgOverlay} style={{ '--accent': p.color }} />
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--c-text-3)] uppercase">
                  {p.year}
                </span>
                <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border ${
                  p.status === 'live'
                    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                    : 'text-violet-400 border-violet-400/30 bg-violet-400/10'
                }`}>
                  {p.status === 'live' ? '● Live' : '◐ En cours'}
                </span>
              </div>

              <p className="font-mono text-[11px] tracking-widest uppercase mb-2" style={{ color: p.color }}>
                {p.subtitle}
              </p>
              <h2 className={styles.cardTitle}>{p.title}</h2>
              <p className={styles.cardDesc}>{p.desc}</p>

              {/* Stack */}
              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {p.stack.map((s) => (
                  <span key={s} className="font-mono text-[11px] px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[var(--c-text-2)]">
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnLive}
                    style={{ '--accent': p.color, '--accent-dim': p.color + '22' }}
                  >
                    Voir le projet ↗
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnGhost}
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>

            {/* Numéro */}
            <span className={styles.cardIndex}>0{p.id}</span>
          </article>
        ))}
      </div>

      {/* ── Banner → 3D ────────────────────── */}
      <Link to="/3d" className={styles.banner3d}>
        <div className={styles.banner3dBg} />
        <div className="relative z-10 flex flex-col gap-2 p-8 md:p-12">
          <span className="font-mono text-xs tracking-widest text-[var(--c-text-3)] uppercase">
            Autre univers
          </span>
          <span className="font-display font-bold text-2xl md:text-4xl text-white">
            Voir mes projets <span className="text-[var(--c-3d)]">3D & Motion →</span>
          </span>
        </div>
      </Link>

    </section>
  )
}