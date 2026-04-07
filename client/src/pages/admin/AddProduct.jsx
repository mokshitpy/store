import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/products', form);
      navigate('/admin/products');
    } catch {
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">🌿 Add Product</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Coconut Oil"
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Product description..."
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1">
              Image URL (optional)
            </label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B35] bg-[#FDFAF5]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B6B35] text-white py-2.5 rounded-lg font-medium hover:bg-[#5A9A52] transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>

      <Link
        to="/admin/products"
        className="inline-block mt-6 text-sm text-[#8B6347] hover:text-[#3B6B35] transition"
      >
        ← Back to Products
      </Link>
    </div>
  );
};

export default AddProduct;