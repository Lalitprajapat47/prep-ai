import { RouterProvider } from "react-router"
import { router } from "./app.route"
import { AuthProvider } from "./features/auth/auth.context"
import { InterviewProvider } from "./features/interview/interview.context"
import "./style.scss"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App