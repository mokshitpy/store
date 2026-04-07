import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Group products by category
  const grouped = products.reduce((acc, product) => {
    const cat = product.category_name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#8B6347] text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="bg-[#3B6B35] rounded-2xl p-10 mb-12 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">
          Fresh From the Farm 🌾
        </h1>
        <p className="text-green-100 text-lg">
          Pure, natural, and organic products delivered to your door
        </p>
      </div>

      {/* Products grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-[#8B6347]">No products available.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-12">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-[#2C1A0E]">{category}</h2>
              <div className="flex-1 h-px bg-[#E5DDD0]"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;