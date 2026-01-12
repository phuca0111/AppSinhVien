import { useState } from 'react'

function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        // Demo: admin / admin123
        if (username === 'admin' && password === 'admin123') {
            onLogin()
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng!')
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="login-logo">🎓</div>
                    <h1 className="login-title">Admin Panel</h1>
                    <p className="login-subtitle">Đăng nhập để quản lý hệ thống</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Đăng nhập
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#999', fontSize: '13px' }}>
                    Demo: admin / admin123
                </p>
            </div>
        </div>
    )
}

export default Login
