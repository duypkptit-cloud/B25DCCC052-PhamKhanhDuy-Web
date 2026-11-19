import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LoginLocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate(from, { replace: true })
    } else {
      setError('Tên đăng nhập trống hoặc mật khẩu không đúng.')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Đăng nhập</h1>
      {from !== '/' && <p className="hint">Bạn cần đăng nhập để vào trang {from}.</p>}

      <label className="field">
        Tên đăng nhập
        <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
      </label>
      <label className="field">
        Mật khẩu
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>

      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="btn btn--primary">Đăng nhập</button>
      <p className="hint">Mật khẩu thử nghiệm: 123456</p>
    </form>
  )
}
