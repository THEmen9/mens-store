import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'

function Cart() {
  const cartSkeletons = Array.from({ length: 3 })

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Cart
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Your Cart
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Review your selected pieces before moving to checkout.
        </p>
      </section>

      {/* Cart Content */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <div className="space-y-6">
            {cartSkeletons.map((_, index) => (
              <CartItem key={index} />
            ))}
          </div>

          {/* Cart Summary */}
          <CartSummary />
        </div>
      </section>
    </main>
  )
}

export default Cart