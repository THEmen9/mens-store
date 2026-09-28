import { useNavigate } from "react-router-dom"

function ItemPreview({ item, order, onCancel, returnExchangeRequests  }) {
  const navigate = useNavigate()

  const createdAt = new Date(order.createdAt)
  const cancelDeadline = new Date(
    createdAt.getTime() + 24 * 60 * 60 * 1000
  )

  // Converts backend status values into customer-friendly labels.
  const statusLabels = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    pickup_pending: "Pickup Pending",
    picked_up: "Picked Up",
    received: "Received",
    completed: "Completed",
  }

  const cancellableStatuses = [
    "pending",
    "confirmed",
    "processing",
  ]

  const canCancel =
    new Date() < cancelDeadline &&
    cancellableStatuses.includes(order.orderStatus)

  // Get all return/exchange requests for this exact order item.
  const itemReturnExchangeRequests = returnExchangeRequests.filter(
    (request) =>
      request.order === order._id &&
      request.orderItem === item._id
  )

  // Calculate how many units of this item have already been completed
  const completedReturnExchangeQuantity =
    itemReturnExchangeRequests
      .filter((request) => request.status === "completed")
      .reduce((total, request) => total + request.quantity, 0)

  // Find the latest completed request so the preview can preserve
  const latestCompletedReturnExchangeRequest =
    itemReturnExchangeRequests
      .filter((request) => request.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt) -
          new Date(a.completedAt || a.createdAt)
      )[0]

  // Find the latest non-completed request for this item.
  const activeReturnExchangeRequest = itemReturnExchangeRequests
    .filter((request) => request.status !== "completed")
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0]

  // Prepare the quantity preview for the customer.
  const completedQuantity = completedReturnExchangeQuantity
  const activeQuantity = activeReturnExchangeRequest?.quantity || 0
  const totalProcessedQuantity = completedQuantity + activeQuantity

  // Build the small status preview shown inside the order item card.
  const returnExchangeStatus = activeReturnExchangeRequest
    ? `${activeReturnExchangeRequest.type === "return" ? "Return" : "Exchange"}: ${
        statusLabels[activeReturnExchangeRequest.status] ||
        activeReturnExchangeRequest.status
      } · ${totalProcessedQuantity} of ${item.quantity}`
      : latestCompletedReturnExchangeRequest
      ? `${latestCompletedReturnExchangeRequest.type === "return" ? "Return" : "Exchange"}: Completed · ${completedReturnExchangeQuantity} of ${item.quantity}`
      : null

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
             onClick={() => onCancel(order._id)}
            className="mt-3 text-sm font-medium"
          >
            Cancel
          </button>
        )}

        {returnExchangeStatus && (
          <p className="mt-3 text-sm text-neutral-500">
            {returnExchangeStatus}
          </p>
        )}

      </div>
    </div>
  )
}

export default ItemPreview