import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'confirmed') return 'bg-blue-100 text-blue-700';
    if (status === 'delivered') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">📦 Orders</h1>

      {loading ? (
        <p className="text-[#8B6347]">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-12 text-center">
          <p className="text-[#8B6347]">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden">
          {orders.map((order, index) => (
            <Link to={`/admin/orders/${order.id}`} key={order.id}>
              <div
                className={`flex items-center justify-between px-6 py-4 hover:bg-[#FDFAF5] transition ${
                  index !== orders.length - 1 ? 'border-b border-[#E5DDD0]' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-[#2C1A0E]">
                    Order #{order.id} — {order.user_name}
                  </p>
                  <p className="text-xs text-[#8B6347]">
                    {order.user_email} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#3B6B35]">₹{order.total_amount}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/admin"
        className="inline-block mt-6 text-sm text-[#8B6347] hover:text-[#3B6B35] transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default OrderList;