import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-[#E5DDD0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#3B6B35]">
          🌿 Store
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2C1A0E]">
          <Link to="/" className="hover:text-[#3B6B35] transition">Home</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-[#3B6B35] transition">
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <span className="text-[#8B6347]">Hi, {user.name}</span>
              {user.role === 'user' && (
                <Link
                  to="/cart"
                  className="bg-[#3B6B35] text-white px-4 py-2 rounded-full hover:bg-[#5A9A52] transition"
                >
                  🛒 Cart
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[#8B6347] hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#2C1A0E] hover:text-[#3B6B35] transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#3B6B35] text-white px-4 py-2 rounded-full hover:bg-[#5A9A52] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;