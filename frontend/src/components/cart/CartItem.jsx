function CartItem({ item }) {
  return (
    <article className="flex gap-4 border-b pb-6">
      <div className="h-32 w-24 overflow-hidden shrink-0 bg-neutral-100 md:h-40 md:w-32">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>


      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="font-medium">
            {item.name}
        </h2>
         <p className="mt-2 text-sm text-neutral-500">
          {item.color} / {item.size}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <p className="text-sm">
            Quantity: {item.quantity}
          </p>
          
          <p className="text-sm font-medium">
            ₹{item.price}
          </p>
        </div>
      </div>
    </article>
  )
}

export default CartItem;