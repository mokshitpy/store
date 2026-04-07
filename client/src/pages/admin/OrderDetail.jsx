import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await API.get('/orders');
      const found = res.data.find((o) => o.id === parseInt(id));
      setOrder(found);
    } catch {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrder();
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'confirmed') return 'bg-blue-100 text-blue-700';
    if (status === 'delivered') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#8B6347]">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">
        📦 Order #{order.id}
      </h1>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6 mb-6">
        <h2 className="font-bold text-[#2C1A0E] mb-4">Customer</h2>
        <p className="text-sm text-[#2C1A0E]">{order.user_name}</p>
        <p className="text-sm text-[#8B6347]">{order.user_email}</p>
        <p className="text-xs text-[#8B6347] mt-1">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden mb-6">
        <h2 className="font-bold text-[#2C1A0E] px-6 py-4 border-b border-[#E5DDD0]">
          Items
        </h2>
        {order.items.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between px-6 py-4 ${
              index !== order.items.length - 1 ? 'border-b border-[#E5DDD0]' : ''
            }`}
          >
            <div>
              <p className="font-medium text-[#2C1A0E] text-sm">{item.name}</p>
              <p className="text-xs text-[#8B6347]">Qty: {item.quantity}</p>
            </div>
            <p className="font-bold text-[#3B6B35] text-sm">
              ₹{(item.quantity * item.price_at_purchase).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-between px-6 py-4 bg-[#FDFAF5]">
          <p className="font-bold text-[#2C1A0E]">Total</p>
          <p className="font-bold text-[#3B6B35]">₹{order.total_amount}</p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6">
        <h2 className="font-bold text-[#2C1A0E] mb-4">Status</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {['pending', 'confirmed', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={updating || order.status === s}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#E5DDD0] hover:bg-[#3B6B35] hover:text-white hover:border-[#3B6B35] transition disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Link
        to="/admin/orders"
        className="inline-block mt-6 text-sm text-[#8B6347] hover:text-[#3B6B35] transition"
      >
        ← Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetail;