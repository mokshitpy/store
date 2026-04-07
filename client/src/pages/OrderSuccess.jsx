import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-12 text-center max-w-md w-full">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-[#2C1A0E] mb-3">Order Placed!</h1>
        <p className="text-[#8B6347] mb-8">
          Thank you for your order. We'll get it ready for you soon.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#3B6B35] text-white py-3 rounded-xl font-medium hover:bg-[#5A9A52] transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;