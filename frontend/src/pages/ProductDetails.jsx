import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductBySlug } from '../api/product.api'
import { Button } from '../components/ui';
import { useCart } from '../context/CartContext'

function ProductDetails() {
    const { slug } = useParams();
    const { cartItems, addToCart } = useCart()

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
            const response = await getProductBySlug(slug)

            console.log('Product details response:', response)

            const fetchedProduct = response.data

            setProduct(fetchedProduct)

            const firstVariant = fetchedProduct.variants?.[0]

            if (firstVariant) {
            setSelectedColor(firstVariant.color)
            setSelectedSize(firstVariant.size)
            }
        } catch (error) {
            console.error('Failed to fetch product:', error)
        }
    }

    fetchProduct()
    }, [slug])

  if (!product) {
    return <p>Loading...</p>
  }
    
    const colors = [...new Set(product.variants.map((variant) => variant.color))]

    const sizes = [...new Set(product.variants.map((variant) => variant.size))]

    const selectedVariant = product.variants.find(
        (variant) =>
            variant.color === selectedColor &&
            variant.size === selectedSize
    )

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      <section className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-4/5 overflow-hidden bg-neutral-100">
            {product.images?.[0]?.url && (
            <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="h-full w-full object-cover"
            />
            )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
            {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
            <span className="text-lg">
                ₹{product.price}
            </span>

            {product.compareAtPrice > product.price && (
                <span className="text-sm text-neutral-500 line-through">
                ₹{product.compareAtPrice}
                </span>
            )}
            </div>

            <p className="mt-6 max-w-xl text-sm leading-6 text-neutral-600">
            {product.description}
            </p>

            {/* Color */}
            <div className="mt-8">
            <p className="text-sm font-medium">
                Color: <span className="font-normal">{selectedColor}</span>
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((color) => (
                <Button
                    key={color}
                   onClick={() => {
                    setSelectedColor(color)

                    const firstAvailableVariant = product.variants.find(
                        (variant) =>
                        variant.color === color &&
                        variant.stock > 0
                    );
                    setSelectedSize(firstAvailableVariant?.size || null)
                    }}
                    className={`border px-4 py-2 text-sm ${
                    selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300'
                    }`}
                >
                    {color}
                </Button>
                ))}
            </div>
            </div>

            {/* Size */}
            <div className="mt-6">
            <p className="text-sm font-medium">
                Size: <span className="font-normal">{selectedSize}</span>
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => {
                const variant = product.variants.find(
                    (item) =>
                    item.color === selectedColor &&
                    item.size === size
                )

                const isAvailable = variant && variant.stock > 0

                return (
                    <button
                    key={size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 text-sm ${
                        selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300'
                    } ${
                        !isAvailable
                        ? 'cursor-not-allowed opacity-40'
                        : ''
                    }`}
                    >
                    {size}
                    </button>
                )
                })}
            </div>

            {selectedVariant && (
                <p className="mt-4 text-sm text-neutral-500">
                {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} available`
                    : 'Out of stock'}
                </p>
            )}

            <Button
            type="button"
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            onClick={() => {
                addToCart({
                productId: product._id,
                variantId: selectedVariant._id,
                quantity: 1,
                name: product.name,
                image: product.images?.[0]?.url,
                color: selectedVariant.color,
                size: selectedVariant.size,
                price: product.price,
                })
            }}
            className="mt-8 w-full px-4 py-3 text-sm font-medium"
            >
                Add to Cart
            </Button>
            </div>
        </div>
    </section>
    </main>
  )
}

export default ProductDetails;