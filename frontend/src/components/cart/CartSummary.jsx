function CartSummary() {
  return (
    <aside className="border-t pt-6 lg:border-t-0 lg:border-l lg:pl-8">
      <div className="h-5 w-24 bg-neutral-100" />

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-neutral-100" />
          <div className="h-4 w-16 bg-neutral-100" />
        </div>

        <div className="flex justify-between border-t pt-4">
          <div className="h-5 w-16 bg-neutral-100" />
          <div className="h-5 w-20 bg-neutral-100" />
        </div>
      </div>

      <div className="mt-6 h-11 w-full bg-neutral-200" />
    </aside>
  )
}

export default CartSummary