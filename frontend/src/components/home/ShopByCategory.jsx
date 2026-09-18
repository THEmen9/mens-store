import { Link } from 'react-router-dom'
import { Card, Container } from '../ui'

const categories = [
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    image: '',
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    image: '',
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    image: '',
  },
  {
    name: 'Trousers',
    slug: 'trousers',
    image: '',
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    image: '',
  },
]

function ShopByCategory() {
  return (
    <section>
      <Container className="py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest">
              Explore
            </p>

            <h2 className="text-3xl font-semibold md:text-4xl">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
            >
              <Card className="group">
                <div className="aspect-4/5 bg-gray-100">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base font-medium">
                    {category.name}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default ShopByCategory;