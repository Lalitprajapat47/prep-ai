import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hookes/useAuth'
import { useNavigate } from 'react-router'
import { getAllInterviewReports } from '../services/interview.api'
import '../../../style/profile.scss'

const Profile = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const heroRef = useRef(null)
    const [reports, setReports] = useState([])
    const [reportsLoading, setReportsLoading] = useState(true)

    // Fetch reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllInterviewReports()
                setReports(data.interviewReports || [])
            } catch (err) {
                setReports([])
            } finally {
                setReportsLoading(false)
            }
        }
        fetchReports()
    }, [])

    // 3D tilt on hero card
    useEffect(() => {
        const card = heroRef.current
        if (!card) return
        const onMove = (e) => {
            const r = card.getBoundingClientRect()
            const x = ((e.clientX - r.left) / r.width - 0.5) * 12
            const y = ((e.clientY - r.top) / r.height - 0.5) * -12
            card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.015)`
        }
        const onLeave = () => { card.style.transform = '' }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
    }, [])

    const onLogout = async () => { await handleLogout(); navigate('/login') }

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

    // Stats derived from reports
    const totalReports = reports.length
    const avgScore = totalReports > 0 ? Math.round(reports.reduce((a, r) => a + (r.matchScore || 0), 0) / totalReports) : 0
    const bestScore = totalReports > 0 ? Math.max(...reports.map(r => r.matchScore || 0)) : 0

    // Skills from all skill gaps
    const allSkills = [...new Set(reports.flatMap(r => (r.skillGaps || []).map(s => s.skill)))].slice(0, 10)

    // Severity color
    const severityColor = (s) => s === 'high' ? '#ff4d82' : s === 'medium' ? '#f59e0b' : '#4ade80'

    if (!user) return <div className='p-loading'><div className='p-loading__ring' /></div>

    return (
        <main className='profile'>
            {/* bg blobs */}
            <div className='profile__blob profile__blob--1' />
            <div className='profile__blob profile__blob--2' />
            <div className='profile__blob profile__blob--3' />

            <div className='profile__grid'>

                {/* ── 1. Hero Card ── */}
                <div className='p-card p-card--hero' ref={heroRef}>
                    <div className='p-card__glow' />
                    <div className='p-avatar-wrap'>
                        <div className='p-avatar'><span>{getInitials(user.username)}</span></div>
                        <div className='p-avatar__ring' />
                        <div className='p-avatar__ring p-avatar__ring--2' />
                    </div>
                    <h1 className='p-name'>{user.username}</h1>
                    <p className='p-email'>{user.email}</p>
                    <div className='p-badges'>
                        <span className='p-badge p-badge--green'><span className='p-badge__dot' />Active</span>
                        <span className='p-badge p-badge--pink'>✦ PrepAI Member</span>
                    </div>
                    <div className='p-hero-actions'>
                        <button className='p-btn p-btn--primary' onClick={() => navigate('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            New Plan
                        </button>
                        <button className='p-btn p-btn--danger' onClick={onLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* ── 2. Stats ── */}
                <div className='p-card p-card--stats'>
                    <p className='p-card__label'>Stats</p>
                    <div className='p-stats'>
                        <div className='p-stat'>
                            <span className='p-stat__num' style={{ color: '#e1034d' }}>{totalReports}</span>
                            <span className='p-stat__label'>Reports</span>
                        </div>
                        <div className='p-stat__divider' />
                        <div className='p-stat'>
                            <span className='p-stat__num' style={{ color: '#a78bfa' }}>{avgScore}%</span>
                            <span className='p-stat__label'>Avg Score</span>
                        </div>
                        <div className='p-stat__divider' />
                        <div className='p-stat'>
                            <span className='p-stat__num' style={{ color: '#4ade80' }}>{bestScore}%</span>
                            <span className='p-stat__label'>Best Score</span>
                        </div>
                    </div>
                    {/* Score bar */}
                    <div className='p-score-bar-wrap'>
                        <div className='p-score-bar-bg'>
                            <div className='p-score-bar-fill' style={{ width: `${avgScore}%` }} />
                        </div>
                        <span className='p-score-bar-label'>Average Match Score</span>
                    </div>
                </div>

                {/* ── 3. Account Info ── */}
                <div className='p-card p-card--info'>
                    <p className='p-card__label'>Account</p>
                    {[
                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, label: 'Username', value: user.username },
                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, label: 'Email', value: user.email },
                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, label: 'Password', value: '••••••••••' },
                    ].map((f, i) => (
                        <div className='p-field' key={i}>
                            <div className='p-field__icon'>{f.icon}</div>
                            <div>
                                <p className='p-field__label'>{f.label}</p>
                                <p className='p-field__value'>{f.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── 4. Skill Gaps ── */}
                <div className='p-card p-card--skills'>
                    <p className='p-card__label'>Skills to Improve</p>
                    {reportsLoading ? (
                        <div className='p-empty'>Loading...</div>
                    ) : allSkills.length === 0 ? (
                        <div className='p-empty'>Generate a report to see skill gaps</div>
                    ) : (
                        <div className='p-skills'>
                            {reports.flatMap(r => r.skillGaps || []).slice(0, 10).map((s, i) => (
                                <span key={i} className='p-skill-tag' style={{ borderColor: severityColor(s.severity) + '55', color: severityColor(s.severity) }}>
                                    {s.skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── 5. Recent Reports ── */}
                <div className='p-card p-card--reports'>
                    <div className='p-card__header'>
                        <p className='p-card__label'>Recent Reports</p>
                        <button className='p-card__link' onClick={() => navigate('/')}>View All →</button>
                    </div>
                    {reportsLoading ? (
                        <div className='p-empty'>Loading...</div>
                    ) : reports.length === 0 ? (
                        <div className='p-empty'>No reports yet. <span onClick={() => navigate('/')} style={{ color: '#e1034d', cursor: 'pointer' }}>Create one →</span></div>
                    ) : (
                        <div className='p-reports'>
                            {reports.slice(0, 4).map((r, i) => (
                                <div key={i} className='p-report-item' onClick={() => navigate(`/interview/${r._id}`)}>
                                    <div className='p-report-item__left'>
                                        <p className='p-report-item__title'>{r.jobTitle || 'Interview Report'}</p>
                                        <p className='p-report-item__date'>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className='p-report-item__score' style={{ color: r.matchScore >= 70 ? '#4ade80' : r.matchScore >= 40 ? '#f59e0b' : '#ff4d82' }}>
                                        {r.matchScore}%
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><polyline points="9 18 15 12 9 6" /></svg>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    )
}

export default Profile