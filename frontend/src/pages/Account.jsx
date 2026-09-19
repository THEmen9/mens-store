function Account() {
  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Your Account
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Manage your profile, orders, addresses, and account preferences.
        </p>
      </section>

      {/* Account Content */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile */}
          <section className="border p-6">
            <div className="h-5 w-24 bg-neutral-100" />

            <div className="mt-6 space-y-4">
              <div>
                <div className="h-3 w-16 bg-neutral-100" />
                <div className="mt-2 h-4 w-40 bg-neutral-100" />
              </div>

              <div>
                <div className="h-3 w-16 bg-neutral-100" />
                <div className="mt-2 h-4 w-52 bg-neutral-100" />
              </div>
            </div>
          </section>

          {/* Orders */}
          <section className="border p-6">
            <div className="h-5 w-24 bg-neutral-100" />

            <div className="mt-6 h-4 w-48 bg-neutral-100" />
          </section>

          {/* Addresses */}
          <section className="border p-6">
            <div className="h-5 w-28 bg-neutral-100" />

            <div className="mt-6 h-4 w-48 bg-neutral-100" />
          </section>

          {/* Settings */}
          <section className="border p-6">
            <div className="h-5 w-32 bg-neutral-100" />

            <div className="mt-6 h-4 w-56 bg-neutral-100" />
          </section>
        </div>
      </section>
    </main>
  )
}

export default Account