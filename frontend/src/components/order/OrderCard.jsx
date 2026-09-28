import ItemPreview from './ItemPreview'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'

function OrderCard({ order, onCancel, returnExchangeRequests }) {
  const navigate = useNavigate()
  return (
    <article className="rounded-2xl  border border-neutral-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
            Order - {order.orderStatus}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
            {new Date(order.createdAt).toLocaleDateString()}
            </p>
        </div>

        
      </div>

      {/* Items */}
      <div className="mt-5 space-y-4">
        {order.items.map((item) => (
          <ItemPreview
            key={item._id}
            item={item}
            order={order}
            onCancel={onCancel}
            returnExchangeRequests={returnExchangeRequests}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-5">
        <div>
          <p className="text-xs text-neutral-500">
            Total
          </p>

          <p className="mt-1 text-sm font-medium">
            ₹{order.total}
          </p>
        </div>

        <Button
          onClick={() => {navigate(`/orders/${order._id}`)}}
          type="button"
          className="text-sm font-medium"
        >
          View Details
        </Button>
      </div>
    </article>
  )
}

export default OrderCard