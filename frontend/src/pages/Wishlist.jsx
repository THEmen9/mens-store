import { Link } from 'react-router-dom'

function Wishlist() {
  const wishlistSkeletons = Array.from({ length: 4 })

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Wishlist
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Your Wishlist
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Keep the pieces you love close and come back to them whenever
          you're ready.
        </p>
      </section>

      {/* Wishlist Content */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {wishlistSkeletons.map((_, index) => (
            <div key={index}>
              <div className="aspect-4/5 overflow-hidden bg-neutral-100" />

              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 bg-neutral-100" />
                <div className="h-4 w-1/3 bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Temporary Empty State Structure */}
      <section className="mx-auto mt-16 hidden max-w-md text-center">
        <h2 className="text-xl font-medium">
          Your wishlist is empty
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Save products you love and they'll appear here.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
        >
          Explore Shop
        </Link>
      </section>
    </main>
  )
}

export default Wishlist