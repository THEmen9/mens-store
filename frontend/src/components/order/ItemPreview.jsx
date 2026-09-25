import { useNavigate } from "react-router-dom"

function ItemPreview({ item, order }) {
  const navigate = useNavigate()

  const createdAt = new Date(order.createdAt)
  const cancelDeadline = new Date(
    createdAt.getTime() + 24 * 60 * 60 * 1000
  )

  const canCancel =
    new Date() < cancelDeadline &&
    order.orderStatus !== "shipped"

  return (
    <div className="flex gap-4">
      {/* Product Image */}
      <button
        type="button"
        onClick={() => navigate(`/products/${item.slug}`)}
        className="shrink-0"
      >
        <img
          src={item.image}
          alt={item.name}
          className="h-24 w-20 rounded-lg object-cover"
        />
      </button>

      {/* Product Information */}
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">
          {item.name}
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          {item.color} • {item.size}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          Qty: {item.quantity}
        </p>

        <p className="mt-2 text-sm font-medium">
          ₹{item.price}
        </p>

        {canCancel && (
          <button
            type="button"
            className="mt-3 text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default ItemPreview