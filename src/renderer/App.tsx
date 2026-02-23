import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
    }

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />
    }

    return <Dashboard onLogout={handleLogout} />
}

export default App