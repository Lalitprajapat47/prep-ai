import React, { useEffect, useState } from 'react'
import '../pages/interviewLoader.scss'

const STEPS = [
    { icon: '📄', text: 'Reading your resume...' },
    { icon: '🔍', text: 'Analyzing job description...' },
    { icon: '🤖', text: 'Gemini AI is thinking...' },
    { icon: '❓', text: 'Crafting interview questions...' },
    { icon: '🗺️', text: 'Building your 7-day roadmap...' },
    { icon: '✨', text: 'Almost ready...' },
]

const InterviewLoader = () => {
    const [step, setStep] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Step cycle every 4s
        const stepTimer = setInterval(() => {
            setStep(s => (s + 1) % STEPS.length)
        }, 4000)

        // Smooth progress bar
        const progressTimer = setInterval(() => {
            setProgress(p => {
                if (p >= 92) return p  // hold at 92 until real data loads
                return p + 0.4
            })
        }, 120)

        return () => {
            clearInterval(stepTimer)
            clearInterval(progressTimer)
        }
    }, [])

    return (
        <div className='il'>
            {/* bg blobs */}
            <div className='il__blob il__blob--1' />
            <div className='il__blob il__blob--2' />

            {/* Center content */}
            <div className='il__content'>

                {/* Orbiting rings */}
                <div className='il__orbit-wrap'>
                    <div className='il__orbit il__orbit--1' />
                    <div className='il__orbit il__orbit--2' />
                    <div className='il__orbit il__orbit--3' />

                    {/* Center logo */}
                    <div className='il__logo'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>

                    {/* Orbiting dots */}
                    <div className='il__dot il__dot--1' />
                    <div className='il__dot il__dot--2' />
                    <div className='il__dot il__dot--3' />
                </div>

                {/* Step text */}
                <div className='il__step-wrap'>
                    <span className='il__step-icon' key={step}>{STEPS[step].icon}</span>
                    <p className='il__step-text' key={`t-${step}`}>{STEPS[step].text}</p>
                </div>

                {/* Progress bar */}
                <div className='il__bar-wrap'>
                    <div className='il__bar'>
                        <div className='il__bar-fill' style={{ width: `${progress}%` }} />
                        <div className='il__bar-glow' style={{ left: `${progress}%` }} />
                    </div>
                    <span className='il__bar-pct'>{Math.round(progress)}%</span>
                </div>

                {/* Step dots */}
                <div className='il__steps'>
                    {STEPS.map((s, i) => (
                        <div key={i} className={`il__step-dot ${i === step ? 'il__step-dot--active' : i < step ? 'il__step-dot--done' : ''}`} />
                    ))}
                </div>

                <p className='il__hint'>This usually takes 20–30 seconds</p>
            </div>
        </div>
    )
}

export default InterviewLoader