import { useState } from 'react';
import { Routes, Route, Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Home, PostDetail, Login, WritePost, NotFound } from './pages';

function Layout({ user, onLogout }: { user: string | null; onLogout: () => void }) {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">MiniBlog</Link>
        <Link to="/" className="nav-link">Trang chủ</Link>
        <Link to="/write" className="nav-link">Viết bài</Link>
        <span className="spacer" />
        {user ? (
          <>
            <span>Xin chào, {user}</span>
            <button onClick={onLogout}>Đăng xuất</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Đăng nhập</Link>
        )}
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const navigate = useNavigate();

  function login(name: string) {
    localStorage.setItem('user', name);
    setUser(name);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={logout} />}>
        <Route index element={<Home />} />
        <Route path="posts/:id" element={<PostDetail user={user} />} />
        <Route path="login" element={<Login onLogin={login} />} />
        <Route path="write" element={user ? <WritePost /> : <Navigate to="/login" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
