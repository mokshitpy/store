import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/categories', { name });
      navigate('/admin/categories');
    } catch {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">📂 Add Category</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Oils, Flour, Spices"
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B6B35] text-white py-2.5 rounded-lg font-medium hover:bg-[#5A9A52] transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <Link
        to="/admin/categories"
        className="inline-block mt-6 text-sm text-[#8B6347] hover:text-[#3B6B35] transition"
      >
        ← Back to Categories
      </Link>
    </div>
  );
};

export default AddCategory;