import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                // ✅ data null/undefined ho toh crash na ho
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                // 401 = not logged in — bilkul normal, koi action nahi
                setUser(null)
            } finally {
                // ✅ Loading hamesha false ho — infinite loop nahi
                setLoading(false)
            }
        }

        getAndSetUser()
    }, []) // ✅ empty dependency — sirf once chalega

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}