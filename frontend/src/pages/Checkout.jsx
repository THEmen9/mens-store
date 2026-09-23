function Checkout() {
  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Checkout
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Complete Your Order
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Customer */}
            <section className="border-t pt-6">
              <h2 className="text-lg font-medium">
                Customer
              </h2>
            </section>

            {/* Address */}
            <section className="border-t pt-6">
              <h2 className="text-lg font-medium">
                Delivery Address
              </h2>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8">
            <h2 className="text-lg font-medium">
              Order Summary
            </h2>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Checkout;