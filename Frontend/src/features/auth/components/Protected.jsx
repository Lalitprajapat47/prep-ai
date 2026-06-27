import { useAuth } from '../hookes/useAuth'
import { Navigate } from 'react-router'
import React from 'react'
import InterviewLoader from '../../interview/pages/InterviewLoader'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return <InterviewLoader />
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected