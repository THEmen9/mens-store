import { Container } from '../ui'
import ProductCard from '../product/ProductCard'

const newProducts = [
  {
    id: 'new-1',
    name: 'Relaxed Cotton Tee',
    slug: 'relaxed-cotton-tee',
    price: 1199,
    compareAtPrice: 1499,
    image: '',
  },
  {
    id: 'new-2',
    name: 'Minimal Oxford Shirt',
    slug: 'minimal-oxford-shirt',
    price: 2199,
    compareAtPrice: 2699,
    image: '',
  },
  {
    id: 'new-3',
    name: 'Straight Fit Denim',
    slug: 'straight-fit-denim',
    price: 2399,
    compareAtPrice: 2899,
    image: '',
  },
  {
    id: 'new-4',
    name: 'Essential Relaxed Trousers',
    slug: 'essential-relaxed-trousers',
    price: 1999,
    compareAtPrice: 2499,
    image: '',
  },
]

function NewArrivals() {
  return (
    <section>
      <Container className="py-16 md:py-24">

        {/* Section heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest">
            Just In
          </p>

          <h2 className="text-3xl font-semibold md:text-4xl">
            New Arrivals
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {newProducts.map((product) => (
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

export default NewArrivals