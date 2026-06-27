import Navbar from "./Navbar"
import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div style={{ position: 'relative' }}>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout