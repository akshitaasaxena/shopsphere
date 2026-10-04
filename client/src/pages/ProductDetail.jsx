import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Loader from '../components/Loader.jsx';
import { formatINR } from '../utils/format.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <Loader />;

  const handleAdd = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const wishlisted = isInWishlist(product._id);

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(product._id);
  };

  return (
    <section className="detail">
      <img src={product.image} alt={product.name} />
      <div>
        <span className="tag">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="muted">by {product.brand} · ★ {product.rating.toFixed(1)}</p>
        <h2>{formatINR(product.price)}</h2>
        <p>{product.description}</p>
        <p className={product.stock > 0 ? 'success' : 'error'}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <div className="row" style={{ marginTop: '16px', flexWrap: 'wrap' }}>
          {product.stock > 0 && (
            <>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="qty"
              />
              <button className="btn" onClick={handleAdd}>Add to cart</button>
            </>
          )}
          <button
            type="button"
            className={`btn ${wishlisted ? 'btn-danger' : 'btn-ghost'}`}
            onClick={handleWishlist}
          >
            {wishlisted ? '♥ In Wishlist' : '♡ Add to Wishlist'}
          </button>
        </div>
        {/* TODO: reviews section - see "Product reviews" issue */}
      </div>
    </section>
  );
}
