import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dentists from './pages/Dentists'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function ProtectedAdminRoute({ children }) {
  const userData = localStorage.getItem('user')
  
  if (!userData) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(userData)
  
  if (user.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dentists" element={<Dentists />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App