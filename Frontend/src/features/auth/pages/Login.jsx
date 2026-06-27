import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hookes/useAuth'
import '../auth.form.scss'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    return (
        <main className='auth-page'>
            <div className='auth-blob auth-blob--1' />
            <div className='auth-blob auth-blob--2' />

            {/* Logo above card */}
            <div className='auth-brand'>
                <div className='auth-brand__icon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                </div>
                <span className='auth-brand__name'>PrepAI</span>
            </div>

            <div className='auth-right'>
                <div className='auth-card'>
                    <div className='auth-card__top'>
                        <h1 className='auth-card__title'>Welcome back</h1>
                        <p className='auth-card__sub'>Sign in to continue your prep journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className='auth-form'>
                        <div className='auth-input-group'>
                            <label>Email</label>
                            <div className='auth-input-wrap'>
                                <svg className='auth-input-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                </svg>
                                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className='auth-input-group'>
                            <label>Password</label>
                            <div className='auth-input-wrap'>
                                <svg className='auth-input-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                                <button type='button' className='auth-input-toggle' onClick={() => setShowPass(s => !s)}>
                                    {showPass
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type='submit' className='auth-submit' disabled={loading}>
                            {loading
                                ? <span className='auth-submit__spinner' />
                                : <>Sign In <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></>
                            }
                        </button>
                    </form>

                    <p className='auth-footer'>
                        Don't have an account? <Link to="/register">Create one →</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login