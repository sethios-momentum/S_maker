import React, { useState } from 'react'

interface LoginProps {
    onLogin: () => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Vérification que l'API Electron est disponible
            if (!window.electronAPI) {
                throw new Error('API Electron non disponible')
            }

            const success = await window.electronAPI.login(username, password)
            
            if (success) {
                onLogin()
            } else {
                setError('Identifiants incorrects')
                setPassword('') // Effacer le mot de passe pour sécurité
            }
        } catch (err) {
            console.error('Erreur de connexion:', err)
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>S-Market</h1>
                <h2>Gestion de Commandes</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez votre nom d'utilisateur"
                            required
                            autoComplete="username"
                            autoFocus
                            disabled={loading}
                            className={error ? 'error' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            required
                            autoComplete="current-password"
                            disabled={loading}
                            className={error ? 'error' : ''}
                        />
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading || !username || !password}
                        className={loading ? 'loading' : ''}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Connexion en cours...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p className="hint">
                        <span className="hint-label">Identifiants par défaut :</span>
                        <br />
                        <code>admin / admin123</code>
                    </p>
                    <p className="version">
                        Version 1.0.0
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login