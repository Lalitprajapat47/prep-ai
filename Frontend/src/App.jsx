import { RouterProvider } from "react-router"
import { router } from "./app.route"
import { AuthProvider } from "./features/auth/auth.context"
import { InterviewProvider } from "./features/interview/interview.context"
import { Toaster } from "react-hot-toast"
import "./style.scss"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(22, 22, 28, 0.95)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: { primary: '#4ade80', secondary: '#161b22' },
              style: { border: '1px solid rgba(74,222,128,0.25)' },
            },
            error: {
              iconTheme: { primary: '#ff4d82', secondary: '#161b22' },
              style: { border: '1px solid rgba(225,3,77,0.3)' },
            },
            loading: {
              iconTheme: { primary: '#ff4d82', secondary: '#161b22' },
            },
          }}
        />
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App