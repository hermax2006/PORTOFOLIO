import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@hooks/useGSAP'
import styles from './Work3D.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Données projets ───────────────────────────────── */
const PROJECTS_3D = [
  {
    id: 1,
    title: 'Modelisation 3D',
    subtitle: 'Expérience WebGL',
    stack: ['Three.js', 'GSAP', 'WebGL', 'JavaScript'],
    desc: 'Scène 3D interactive avec modèles, éclairage dynamique et animations fluides directement dans le navigateur.',
    year: '2024',
    status: 'live',
    link: 'https://symphonious-pasca-25222b.netlify.app',
    github: null,
    color: '#ff6b4a',
    bg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=85',
  },
  {
    id: 2,
    title: 'Scroll Experience',
    subtitle: 'Animation pilotée par le scroll',
    stack: ['GSAP', 'ScrollTrigger', 'CSS', 'JavaScript'],
    desc: 'Expérience narrative pilotée par le scroll avec transitions et animations cinématiques synchronisées.',
    year: '2024',
    status: 'wip',
    link: null,
    github: null,
    color: '#f472b6',
    bg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85',
  },
  {
    id: 3,
    title: 'Blender Animation',
    subtitle: 'Motion Design & Montage',
    stack: ['Blender', 'Animation 3D', 'Montage'],
    desc: 'Animations 3D réalisées sous Blender avec rendu cycles, rig de personnages et montage vidéo final.',
    year: '2023',
    status: 'wip',
    link: null,
    github: null,
    color: '#fb923c',
    bg: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=900&q=85',
  },
]

/* ── Scène Three.js dédiée à une card ────────────────── */
function ThreeCard({ index, color }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 4

    // Lumières
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const pt = new THREE.PointLight(new THREE.Color(color), 30, 15)
    pt.position.set(2, 2, 3)
    scene.add(pt)

    // Géométries différentes par card
    const geos = [
      new THREE.TorusKnotGeometry(0.9, 0.28, 120, 16),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.IcosahedronGeometry(1.0, 1),
    ]
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.85,
      roughness: 0.15,
      wireframe: index === 1,
      flatShading: index === 2,
    })
    const mesh = new THREE.Mesh(geos[index % geos.length], mat)
    scene.add(mesh)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      mouse.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    canvas.addEventListener('mousemove', onMove)

    // ScrollTrigger — rotation pilotée par le scroll
    const st = ScrollTrigger.create({
      trigger: canvas.closest('article'),
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        mesh.rotation.y = self.progress * Math.PI * 2
        mesh.rotation.x = self.progress * Math.PI * 0.5
      },
    })

    let frame
    const clock = new THREE.Clock()
    const tick = () => {
      frame = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      // Idle rotation + mouse
      mesh.rotation.y += 0.004 + mouse.x * 0.003
      mesh.rotation.x += 0.002 + mouse.y * 0.002
      // Breathing scale
      mesh.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('mousemove', onMove)
      st.kill()
      geos[index % geos.length].dispose()
      mat.dispose()
      renderer.dispose()
    }
  }, [index, color])

  return <canvas ref={canvasRef} className={styles.threeCanvas} />
}

/* ── Page principale ──────────────────────────────── */
export default function Work3D() {
  const ref = useRef()

  useGSAP(({ gsap }) => {
    // Header parallax
    gsap.from(`.${styles.title}`, {
      y: 80, opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: `.${styles.header}`, start: 'top 88%' },
    })
    gsap.from(`.${styles.subtitle}`, {
      y: 40, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: `.${styles.header}`, start: 'top 88%' },
    })

    // Cards : fade + scale depuis le bas
    document.querySelectorAll(`.${styles.card}`).forEach((card, i) => {
      gsap.from(card, {
        y: 100, opacity: 0, scale: 0.96,
        duration: 1.1, delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      })
    })

    // Ligne de scan horizontale au scroll (pseudo progress)
    gsap.to(`.${styles.scanLine}`, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: `.${styles.cards}`,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: true,
      },
    })
  }, [], { scope: ref })

  return (
    <section ref={ref} className={`${styles.page} page`}>

      {/* ── Background ambient glow ──────────── */}
      <div className={styles.ambientGlow} />

      {/* ── Header ─────────────────────────── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className="text-[var(--c-3d)] font-mono text-xs tracking-widest">// 02</span>
          <span className="text-[var(--c-text-3)] font-mono text-xs tracking-widest"> — 3D Motion</span>
        </p>
        <h1 className={styles.title}>
          Projets<br />
          <span className={styles.titleGrad}>3D & Motion</span>
        </h1>
        <p className={styles.subtitle}>
          Scènes WebGL, animations 3D et expériences visuelles.
          Chaque objet ci-dessous est rendu en temps réel — interagis avec.
        </p>

        {/* Scan progress line */}
        <div className={styles.scanTrack}>
          <div className={styles.scanLine} />
        </div>
      </div>

      {/* ── Cards ──────────────────────────── */}
      <div className={styles.cards}>
        {PROJECTS_3D.map((p, i) => (
          <article key={p.id} className={styles.card}>

            {/* Scène Three.js live */}
            <div className={styles.cardScene}>
              <ThreeCard index={i} color={p.color} />
              <div className={styles.sceneOverlay} style={{ '--accent': p.color }} />
            </div>

            {/* Contenu */}
            <div className={styles.cardBody}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--c-text-3)] uppercase">
                  {p.year}
                </span>
                <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border ${
                  p.status === 'live'
                    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                    : 'text-amber-400 border-amber-400/30 bg-amber-400/10'
                }`}>
                  {p.status === 'live' ? '● Live' : '◐ En cours'}
                </span>
              </div>

              <p className="font-mono text-[11px] tracking-widest uppercase mb-2" style={{ color: p.color }}>
                {p.subtitle}
              </p>
              <h2 className={styles.cardTitle}>{p.title}</h2>
              <p className={styles.cardDesc}>{p.desc}</p>

              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {p.stack.map((s) => (
                  <span key={s} className="font-mono text-[11px] px-3 py-1 rounded-full"
                    style={{
                      border: `1px solid ${p.color}44`,
                      background: `${p.color}11`,
                      color: p.color,
                    }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer"
                    className={styles.btnLive}
                    style={{ '--accent': p.color }}>
                    Voir le projet ↗
                  </a>
                )}
                {!p.link && (
                  <span className="font-mono text-xs text-[var(--c-text-3)] border border-white/10 px-4 py-2 rounded-full">
                    Bientôt disponible
                  </span>
                )}
              </div>
            </div>

            <span className={styles.cardIndex}>0{p.id}</span>
          </article>
        ))}
      </div>

      {/* ── Banner → Dev ────────────────────── */}
      <Link to="/dev" className={styles.bannerDev}>
        <div className={styles.bannerDevBg} />
        <div className="relative z-10 flex flex-col gap-2 p-8 md:p-12">
          <span className="font-mono text-xs tracking-widest text-[var(--c-text-3)] uppercase">
            Autre univers
          </span>
          <span className="font-display font-bold text-2xl md:text-4xl text-white">
            Voir mes projets <span className="text-[var(--c-dev)]">Dev Web →</span>
          </span>
        </div>
      </Link>

    </section>
  )
}