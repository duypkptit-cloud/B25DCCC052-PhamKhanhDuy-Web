import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchProducts, selectProductById, selectProductsStatus } from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'
import { formatPrice } from '../utils'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectProductsStatus)
  const product = useAppSelector(selectProductById(productId))

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  if (status === 'idle' || status === 'loading') return <p className="state" role="status">Đang tải sản phẩm…</p>
  if (status === 'failed') return <p className="state state--error" role="alert">Không tải được sản phẩm.</p>

  if (!product) {
    return (
      <div className="state">
        <p>Không tìm thấy sản phẩm số {id}.</p>
        <Link to="/" className="btn btn--primary">Về trang chủ</Link>
      </div>
    )
  }

  return (
    <article className="detail">
      <div className="detail__media">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="detail__info">
        <Link to="/" className="back">← Tất cả sản phẩm</Link>
        <p className="card__category">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="price price--lg">{formatPrice(product.price)}</p>
        <p className="detail__desc">{product.description}</p>
        <button type="button" className="btn btn--primary" onClick={() => dispatch(addToCart(product))}>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}
