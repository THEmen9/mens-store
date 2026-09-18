import { Container } from '../ui'
import ProductCard from '../product/ProductCard'

const featuredProducts = [
  {
    id: 'featured-1',
    name: 'Essential Overshirt',
    slug: 'essential-overshirt',
    price: 2499,
    compareAtPrice: 2999,
    image: '',
  },
  {
    id: 'featured-2',
    name: 'Relaxed Fit Shirt',
    slug: 'relaxed-fit-shirt',
    price: 1999,
    compareAtPrice: 2499,
    image: '',
  },
  {
    id: 'featured-3',
    name: 'Classic Straight Jeans',
    slug: 'classic-straight-jeans',
    price: 2299,
    compareAtPrice: 2799,
    image: '',
  },
  {
    id: 'featured-4',
    name: 'Everyday T-Shirt',
    slug: 'everyday-t-shirt',
    price: 1299,
    compareAtPrice: 1599,
    image: '',
  },
]

function FeaturedCollection() {
  return (
    <section>
      <Container className="py-16 md:py-24">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest">
            Curated Selection
          </p>

          <h2 className="text-3xl font-semibold md:text-4xl">
            Featured Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FeaturedCollection;