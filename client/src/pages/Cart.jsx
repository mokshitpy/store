import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      fetchCart();
    } catch {
      console.error('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await API.post('/orders');
      navigate('/order-success');
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#8B6347]">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">🛒 Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-12 text-center">
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-[#8B6347] text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#3B6B35] text-white px-6 py-2.5 rounded-xl hover:bg-[#5A9A52] transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden mb-6">
            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  index !== cart.items.length - 1 ? 'border-b border-[#E5DDD0]' : ''
                }`}
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FDFAF5] rounded-lg flex items-center justify-center text-2xl">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      '🌿'
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#2C1A0E] text-sm">{item.name}</p>
                    <p className="text-xs text-[#8B6347]">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#3B6B35]">
                    ₹{item.subtotal}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-[#2C1A0E]">Total</span>
              <span className="text-2xl font-bold text-[#3B6B35]">
                ₹{cart.total}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-[#3B6B35] text-white py-3 rounded-xl font-medium hover:bg-[#5A9A52] transition disabled:opacity-50"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;