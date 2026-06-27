import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hookes/useAuth'
import './Navbar.scss'

const Navbar = () => {
    // ✅ SARE HOOKS PEHLE - koi bhi condition se pehle
    const location = useLocation()
    const { user, handleLogout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // ✅ return null SARE hooks ke BAAD
    const hideOn = ['/login', '/register']
    if (hideOn.includes(location.pathname)) return null

    const onLogout = async () => {
        await handleLogout()
        setDropdownOpen(false)
        navigate('/login')
    }

    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <nav className='navbar'>
            <Link to='/' className='navbar__logo'>
                <span className='navbar__logo-icon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                </span>
                <span>PrepAI</span>
            </Link>

            <div className='navbar__right'>
                {user ? (
                    <div className='navbar__profile' ref={dropdownRef}>
                        <button
                            className='navbar__avatar'
                            onClick={() => setDropdownOpen(o => !o)}
                            title={user.username}
                        >
                            <span className='navbar__avatar-initials'>
                                {getInitials(user.username)}
                            </span>
                            <span className='navbar__avatar-chevron'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12" height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className='navbar__dropdown'>
                                <div className='navbar__dropdown-header'>
                                    <div className='navbar__dropdown-avatar'>
                                        {getInitials(user.username)}
                                    </div>
                                    <div>
                                        <p className='navbar__dropdown-name'>{user.username}</p>
                                        <p className='navbar__dropdown-email'>{user.email}</p>
                                    </div>
                                </div>

                                <div className='navbar__dropdown-divider' />

                                <Link to='/' className='navbar__dropdown-item' onClick={() => setDropdownOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Dashboard
                                </Link>

                                <Link to='/profile' className='navbar__dropdown-item' onClick={() => setDropdownOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    My Profile
                                </Link>

                                <div className='navbar__dropdown-divider' />

                                <button className='navbar__dropdown-item navbar__dropdown-item--logout' onClick={onLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='navbar__auth-links'>
                        <Link to='/login' className='navbar__link'>Login</Link>
                        <Link to='/register' className='navbar__link navbar__link--cta'>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar