import { Link } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'
import { formatPrice } from '../utils'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card__media" aria-label={product.title}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <div className="card__body">
        <p className="card__category">{product.category}</p>
        <h3 className="card__title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="card__footer">
          <span className="price">{formatPrice(product.price)}</span>
          <button type="button" className="btn btn--primary" onClick={() => dispatch(addToCart(product))}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </article>
  )
}
