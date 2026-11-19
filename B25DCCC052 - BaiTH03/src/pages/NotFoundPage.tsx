import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="state">
      <h1>404 — Không tìm thấy trang</h1>
      <p>Đường dẫn này không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="btn btn--primary">Về trang chủ</Link>
    </div>
  )
}
