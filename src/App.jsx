import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import './App.scss'
import Welcome from './pages/Welcome/Welcome'
import Request from './pages/Request/Request'
import ClientDashboard from './pages/Client/ClientDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </div>
  )
}

export default App
