import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../features/cart/cartSlice'
import { formatPrice } from '../utils'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="state">
        <h1>Giỏ hàng trống</h1>
        <p>Chọn vài sản phẩm để bắt đầu.</p>
        <Link to="/" className="btn btn--primary">Xem sản phẩm</Link>
      </div>
    )
  }

  return (
    <section>
      <div className="toolbar">
        <h1>Giỏ hàng ({count})</h1>
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(clearCart())}>
          Xoá giỏ hàng
        </button>
      </div>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-row">
            <img src={item.image} alt="" className="cart-row__img" />
            <div className="cart-row__info">
              <Link to={`/products/${item.id}`}>{item.title}</Link>
              <span className="price">{formatPrice(item.price)}</span>
            </div>
            <div className="qty">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                aria-label={`Giảm số lượng ${item.title}`}
              >
                −
              </button>
              <span aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                aria-label={`Tăng số lượng ${item.title}`}
              >
                +
              </button>
            </div>
            <span className="cart-row__sum">{formatPrice(item.price * item.quantity)}</span>
            <button type="button" className="btn btn--ghost" onClick={() => dispatch(removeFromCart(item.id))}>
              Xoá
            </button>
          </li>
        ))}
      </ul>

      <div className="summary">
        <p>Tổng cộng <strong className="price price--lg">{formatPrice(total)}</strong></p>
        <Link to="/checkout" className="btn btn--primary">Thanh toán</Link>
      </div>
    </section>
  )
}
