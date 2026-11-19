import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  /** Trả về true nếu đăng nhập thành công (giả lập: password = "123456"). */
  login: (username: string, password: string) => boolean
  logout: () => void
}

const USER_KEY = 'shopmini-user'
const FAKE_PASSWORD = '123456'
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  const login = useCallback((username: string, password: string) => {
    const name = username.trim()
    if (!name || password !== FAKE_PASSWORD) return false
    const next: User = { username: name }
    setUser(next)
    localStorage.setItem(USER_KEY, JSON.stringify(next))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>')
  return ctx
}
