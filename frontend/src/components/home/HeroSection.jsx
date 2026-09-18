import { Link } from 'react-router-dom'
import { Button, Container } from '../ui'

function HeroSection() {
  return (
    <section>
      <Container className="py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          
          {/* Content */}
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm uppercase tracking-widest">
              New Collection
            </p>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
              Modern essentials for everyday men.
            </h1>

            <p className="max-w-lg text-base leading-7 text-gray-600 md:text-lg">
              Thoughtfully designed menswear built around simplicity,
              comfort, and everyday confidence.
            </p>

            <Button className="border px-5 py-3">
              <Link to="/products">
                Shop Collection
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="aspect-4/5 overflow-hidden bg-gray-100">
            <div
              className="h-full w-full"
              aria-label="Featured men's fashion collection"
              role="img"
            />
          </div>

        </div>
      </Container>
    </section>
  )
}

export default HeroSection;