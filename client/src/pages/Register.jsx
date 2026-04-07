import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DDD0] p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3B6B35]">🌿 Create Account</h1>
          <p className="text-[#8B6347] mt-2 text-sm">Join us today</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B6B35] text-white py-2.5 rounded-lg font-medium hover:bg-[#5A9A52] transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8B6347] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3B6B35] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;