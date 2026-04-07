import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-xl border border-[#E5DDD0] overflow-hidden hover:shadow-md transition cursor-pointer">
        {/* Image */}
        <div className="bg-[#FDFAF5] h-44 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-5xl">🌿</span>
          )}
        </div>

        {/* Details */}
        <div className="p-3">
          <h3 className="font-semibold text-[#2C1A0E] text-sm truncate">
            {product.name}
          </h3>
          <p className="text-xs text-[#8B6347] mt-0.5">{product.category_name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[#3B6B35] font-bold text-sm">
              ₹{product.price}
            </span>
            <span className="text-xs text-[#8B6347]">
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;