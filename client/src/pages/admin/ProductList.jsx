import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  // Group by category
  const grouped = products.reduce((acc, product) => {
    const cat = product.category_name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#2C1A0E]">🌿 Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-[#3B6B35] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#5A9A52] transition"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-[#8B6347]">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-12 text-center">
          <p className="text-[#8B6347]">No products yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-bold text-[#2C1A0E] mb-3">{category}</h2>
            <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden">
              {items.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    index !== items.length - 1 ? 'border-b border-[#E5DDD0]' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-[#2C1A0E]">{product.name}</p>
                    <p className="text-xs text-[#8B6347]">
                      ₹{product.price} · Stock: {product.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
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

export default ProductList;