import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert('Failed to delete. Make sure no products are under this category.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#2C1A0E]">📂 Categories</h1>
        <Link
          to="/admin/categories/add"
          className="bg-[#3B6B35] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#5A9A52] transition"
        >
          + Add Category
        </Link>
      </div>

      {loading ? (
        <p className="text-[#8B6347]">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-12 text-center">
          <p className="text-[#8B6347]">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-6 py-4 ${
                index !== categories.length - 1 ? 'border-b border-[#E5DDD0]' : ''
              }`}
            >
              <div>
                <p className="font-medium text-[#2C1A0E]">{cat.name}</p>
                <p className="text-xs text-[#8B6347]">
                  Added {new Date(cat.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-400 hover:text-red-600 text-sm transition"
              >
                Delete
              </button>
            </div>
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

export default CategoryList;