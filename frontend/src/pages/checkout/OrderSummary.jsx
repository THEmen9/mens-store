function OrderSummary({ cartItems, subtotal }) {
  return (
    <aside className="border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8">
      <h2 className="text-lg font-medium">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        {cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex justify-between gap-4 text-sm"
          >
            <div>
              <p>{item.name}</p>

              <p className="text-neutral-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p>
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default OrderSummary