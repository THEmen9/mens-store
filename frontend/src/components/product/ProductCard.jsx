import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import { Card, Button } from '../ui'


function ProductCard({ product }) {
  const {
    name,
    slug,
    price,
    compareAtPrice,
    image,
  } = product

  return (
  <Card className="group">
    <div className="relative">
      <Link to={`/products/${slug}`}>

        <div className="aspect-4/5 overflow-hidden bg-gray-100">
          {image && (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

      </Link>

        <Button
          aria-label={`Add ${name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"
        >
          <FiHeart size={18} />
        </Button>          
    </div>
          
      <div className="flex flex-col gap-1 p-4">
        <Link to={`/products/${slug}`}>
          <h3 className="font-medium">
            {name}
          </h3>

          <div className="flex items-center gap-2">
            <span>
              ₹{price}
            </span>

            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{compareAtPrice}
              </span>
            )}
          </div>
        </Link>

        <Button
          className="mt-3 flex w-full items-center justify-center gap-2 border px-4 py-2 text-sm font-medium"
        >
          <FiShoppingBag size={16} />
          Add to Cart
        </Button>
      </div>
  </Card>
  )
}

export default ProductCard;