import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-2">
        Admin Dashboard
      </h1>
      <p className="text-[#8B6347] mb-10">Welcome, {user?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/admin/categories">
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-8 hover:shadow-md transition text-center">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-xl font-bold text-[#2C1A0E] mb-2">Categories</h2>
            <p className="text-sm text-[#8B6347]">Manage product categories</p>
          </div>
        </Link>

        <Link to="/admin/products">
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-8 hover:shadow-md transition text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-xl font-bold text-[#2C1A0E] mb-2">Products</h2>
            <p className="text-sm text-[#8B6347]">Add and manage products</p>
          </div>
        </Link>

        <Link to="/admin/orders">
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-8 hover:shadow-md transition text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-[#2C1A0E] mb-2">Orders</h2>
            <p className="text-sm text-[#8B6347]">View and manage orders</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;