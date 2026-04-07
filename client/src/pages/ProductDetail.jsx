import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await API.post('/cart', { product_id: product.id, quantity });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#8B6347]">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-[#8B6347] text-sm mb-6 hover:text-[#3B6B35] transition"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden flex flex-col md:flex-row">
        {/* Image */}
        <div className="bg-[#FDFAF5] md:w-1/2 h-64 md:h-auto flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-8xl">🌿</span>
          )}
        </div>

        {/* Details */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <span className="text-xs font-medium text-[#8B6347] uppercase tracking-wide mb-2">
            {product.category_name}
          </span>
          <h1 className="text-3xl font-bold text-[#2C1A0E] mb-3">
            {product.name}
          </h1>
          <p className="text-[#8B6347] text-sm mb-6 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-[#3B6B35]">
              ₹{product.price}
            </span>
            <span className="text-sm text-[#8B6347]">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-[#2C1A0E]">Qty:</span>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full border border-[#E5DDD0] flex items-center justify-center text-[#2C1A0E] hover:bg-[#FDFAF5]"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="w-8 h-8 rounded-full border border-[#E5DDD0] flex items-center justify-center text-[#2C1A0E] hover:bg-[#FDFAF5]"
            >
              +
            </button>
          </div>

          {/* Message */}
          {message && (
            <p className="text-sm text-[#3B6B35] font-medium mb-3">{message}</p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="bg-[#3B6B35] text-white py-3 rounded-xl font-medium hover:bg-[#5A9A52] transition disabled:opacity-50"
          >
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;