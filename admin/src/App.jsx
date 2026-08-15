import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Leads from './pages/Leads'
import Watches from './pages/Watches'
import ProtectedRoute from './components/ProtectedRoute'

function NavBar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Selecta Watches</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/leads" style={{ color: 'white', textDecoration: 'none', hover: { opacity: 0.8 } }}>
            Leads
          </Link>
          <Link to="/watches" style={{ color: 'white', textDecoration: 'none' }}>
            Catálogo
          </Link>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Olá, {user.username}</span>
        <button className="secondary" onClick={handleLogout} style={{ padding: '6px 12px' }}>
          Sair
        </button>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watches"
          element={
            <ProtectedRoute>
              <Watches />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/leads" replace />} />
      </Routes>
    </Router>
  )
}
