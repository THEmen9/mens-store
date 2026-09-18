import { Link } from 'react-router-dom'
import { Button, Container } from '../ui'

function BrandStory() {
  return (
    <section>
      <Container className="py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">

          {/* Visual */}
          <div
            className="aspect-4/5 bg-gray-100"
            role="img"
            aria-label="Brand editorial visual"
          />

          {/* Content */}
          <div className="max-w-xl">
            <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">
              Our Approach
            </p>

            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Designed for modern everyday life.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              We focus on thoughtful essentials, clean silhouettes, and
              versatile pieces made to fit naturally into everyday wardrobes.
            </p>

            <Button className="mt-7">
              <Link to="/about">Discover Our Story</Link>
            </Button>
          </div>

        </div>
      </Container>
    </section>
  )
}

export default BrandStory;