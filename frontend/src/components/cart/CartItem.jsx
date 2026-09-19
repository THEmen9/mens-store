function CartItem() {
  return (
    <article className="flex gap-4 border-b pb-6">
      <div className="h-32 w-24 shrink-0 bg-neutral-100 md:h-40 md:w-32" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-4 w-2/3 bg-neutral-100" />
        <div className="mt-3 h-3 w-1/3 bg-neutral-100" />

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="h-8 w-24 bg-neutral-100" />
          <div className="h-4 w-16 bg-neutral-100" />
        </div>
      </div>
    </article>
  )
}

export default CartItem