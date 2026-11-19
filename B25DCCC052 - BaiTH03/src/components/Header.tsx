import { Link, NavLink } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCartCount } from '../features/cart/cartSlice'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Header() {
  const count = useAppSelector(selectCartCount)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">ShopMini</Link>

        <nav className="header__nav" aria-label="Điều hướng chính">
          <NavLink to="/cart" className="navlink">
            Giỏ hàng
            <span className="badge" aria-label={`${count} sản phẩm trong giỏ`}>{count}</span>
          </NavLink>

          {user ? (
            <>
              <span className="header__user">Xin chào, <strong>{user.username}</strong></span>
              <button type="button" className="btn btn--ghost" onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <NavLink to="/login" className="navlink">Đăng nhập</NavLink>
          )}

          <button
            type="button"
            className="btn btn--ghost"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
          >
            {theme === 'light' ? 'Tối' : 'Sáng'}
          </button>
        </nav>
      </div>
    </header>
  )
}
