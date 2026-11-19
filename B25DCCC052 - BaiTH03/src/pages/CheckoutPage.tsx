import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const [ordered, setOrdered] = useState(false)

  if (ordered) {
    return (
      <div className="state state--success" role="status">
        <h1>Đặt hàng thành công</h1>
        <p>Cảm ơn {user?.username}, đơn hàng của bạn đã được ghi nhận.</p>
        <Link to="/" className="btn btn--primary">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="state">
        <h1>Chưa có gì để thanh toán</h1>
        <Link to="/" className="btn btn--primary">Xem sản phẩm</Link>
      </div>
    )
  }

  const handleOrder = () => {
    dispatch(clearCart())
    setOrdered(true)
  }

  return (
    <section>
      <h1>Thanh toán</h1>
      <p className="hint">Người đặt: {user?.username}</p>
      <ul className="cart-list">
        {items.map((i) => (
          <li key={i.id} className="cart-row cart-row--compact">
            <span>{i.title} × {i.quantity}</span>
            <span className="cart-row__sum">{formatPrice(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="summary">
        <p>Tổng cộng <strong className="price price--lg">{formatPrice(total)}</strong></p>
        <button type="button" className="btn btn--primary" onClick={handleOrder}>Đặt hàng</button>
      </div>
    </section>
  )
}
