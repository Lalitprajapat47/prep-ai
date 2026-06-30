import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";
import toast from "react-hot-toast";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
                toast.success(`Welcome back, ${data.user.username}!`)
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid email or password"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleRegistar = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
                toast.success(`Welcome to PrepAI, ${data.user.username}!`)
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed. Try again."
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            toast.success("Logged out successfully")
        } catch (err) {
            toast.error("Something went wrong while logging out")
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegistar, handleLogin, handleLogout }
}