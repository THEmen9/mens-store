import ProductCard from '../components/product/ProductCard'

function NewArrivals() {
  const productSkeletons = Array.from({ length: 6 })

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          New Arrivals
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Fresh Arrivals
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Discover the latest pieces added to our collection,
          designed for modern everyday dressing.
        </p>
      </section>

      {/* Product Grid */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {productSkeletons.map((_, index) => (
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
    </main>
  )
}

export default NewArrivals