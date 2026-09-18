import { Link } from 'react-router-dom'
import { Card } from '../ui'

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

        <div className="flex flex-col gap-1 p-4">
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
        </div>
      </Link>
    </Card>
  )
}

export default ProductCard;