import React, { useState, useRef, useEffect } from 'react'
import "../../../style/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import InterviewLoader from './InterviewLoader'

// ── Animated Counter Hook ───────────────────────────────────────────────────
const useCountUp = (target, duration = 1200, trigger = true) => {
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!trigger) return
        let start = null
        const step = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target, trigger])
    return value
}

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [dragOver, setDragOver] = useState(false)
    const [fileName, setFileName] = useState(null)
    const resumeInputRef = useRef()
    const navigate = useNavigate()
    const canvasRef = useRef()
    const cardRef = useRef()

    // ── Particle network animation ──────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const PARTICLE_COUNT = 60
        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.15,
        }))

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 130) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(225, 3, 77, ${0.12 * (1 - dist / 130)})`
                        ctx.lineWidth = 0.6
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
            particles.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(225, 3, 77, ${p.alpha})`
                ctx.fill()
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1
            })
            animId = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
    }, [])

    // ── 3D tilt on main card ────────────────────────────────────────────────
    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        const onMove = (e) => {
            const r = card.getBoundingClientRect()
            const x = ((e.clientX - r.left) / r.width - 0.5) * 3
            const y = ((e.clientY - r.top) / r.height - 0.5) * -3
            card.style.transform = `perspective(1400px) rotateX(${y}deg) rotateY(${x}deg)`
        }
        const onLeave = () => { card.style.transform = '' }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
    }, [])

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data?._id) navigate(`/interview/${data._id}`)
        
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            const dt = new DataTransfer()
            dt.items.add(file)
            resumeInputRef.current.files = dt.files
            setFileName(file.name)
        }
    }

    // Stats
    const totalReports = reports.length
    const avgScore = totalReports > 0 ? Math.round(reports.reduce((a, r) => a + (r.matchScore || 0), 0) / totalReports) : 0
    const bestScore = totalReports > 0 ? Math.max(...reports.map(r => r.matchScore || 0)) : 0

    const animReports = useCountUp(totalReports, 1000, true)
    const animAvg = useCountUp(avgScore, 1200, true)
    const animBest = useCountUp(bestScore, 1400, true)

    if (loading) return <InterviewLoader />

    return (
        <div className='home-page'>
            <canvas ref={canvasRef} className='home-canvas' />
            <div className='home-blob home-blob--1' />
            <div className='home-blob home-blob--2' />

            {/* ── Header ── */}
            <header className='page-header'>
                <div className='page-header__eyebrow'>
                    <span className='page-header__dot' />
                    AI-Powered Interview Prep
                </div>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>

                {/* ── Live Stats Strip ── */}
                {totalReports > 0 && (
                    <div className='stats-strip'>
                        <div className='stats-strip__item'>
                            <span className='stats-strip__num'>{animReports}</span>
                            <span className='stats-strip__label'>Plans Created</span>
                        </div>
                        <div className='stats-strip__sep' />
                        <div className='stats-strip__item'>
                            <span className='stats-strip__num' style={{ color: '#a78bfa' }}>{animAvg}%</span>
                            <span className='stats-strip__label'>Avg Match</span>
                        </div>
                        <div className='stats-strip__sep' />
                        <div className='stats-strip__item'>
                            <span className='stats-strip__num' style={{ color: '#4ade80' }}>{animBest}%</span>
                            <span className='stats-strip__label'>Best Score</span>
                        </div>
                    </div>
                )}
            </header>

            {/* ── Main Card (3D tilt) ── */}
            <div className='interview-card' ref={cardRef}>
                <div className='interview-card__glow' />
                <div className='interview-card__body'>

                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    <div className='panel-divider' />

                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label
                                className={`dropzone ${dragOver ? 'dropzone--active' : ''} ${fileName ? 'dropzone--filled' : ''}`}
                                htmlFor='resume'
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <span className='dropzone__icon'>
                                    {fileName
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    }
                                </span>
                                <p className='dropzone__title'>{fileName || 'Click to upload or drag & drop'}</p>
                                <p className='dropzone__subtitle'>{fileName ? '✓ File ready' : 'PDF or DOCX (Max 5MB)'}</p>
                                <input
                                    ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,.docx'
                                    onChange={(e) => setFileName(e.target.files[0]?.name || null)}
                                />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button onClick={handleGenerateReport} className='generate-btn'>
                        <span className='generate-btn__shine' />
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* ── Recent Reports ── */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <div className='recent-reports__header'>
                        <h2>My Recent Interview Plans</h2>
                        <span className='recent-reports__count'>{reports.length} total</span>
                    </div>
                    <ul className='reports-list'>
                        {reports.map((report, i) => {
                            const scoreClass = report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'
                            return (
                                <li
                                    key={report._id}
                                    className='report-item'
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='report-item__top'>
                                        <h3>{report.jobTitle || "Untitled Position"}</h3>
                                        <span className={`report-item__ring ${scoreClass}`}>
                                            <svg viewBox="0 0 36 36">
                                                <path className='ring-bg' d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className='ring-fill' strokeDasharray={`${report.matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            </svg>
                                            <span className='report-item__score-text'>{report.matchScore}%</span>
                                        </span>
                                    </div>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <span className='report-item__arrow'>View Report →</span>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <p className='page-footer__copyright'>
                    © {new Date().getFullYear()} PrepAI. All rights reserved.
                </p>
                <div className='page-footer__links'>
                    <a href='#'>Privacy Policy</a>
                    <span className='page-footer__sep'>•</span>
                    <a href='#'>Terms of Service</a>
                    <span className='page-footer__sep'>•</span>
                    <a href='#'>Help Center</a>
                </div>
            </footer>
        </div>
    )
}

export default Home