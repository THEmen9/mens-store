import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { getOrderById } from '../api/order.api'

function OrderDetails() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getOrderById(id, token)

        setOrder(response.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (token && id) {
      fetchOrder()
    }
  }, [token, id])

  if (isLoading) {
    return <div className="py-6">Loading order...</div>
  }

  if (error) {
    return <div className="py-6">{error}</div>
  }

  if (!order) {
    return <div className="py-6">Order not found.</div>
  }

  return (
    <section className="py-6">
      {/* Header */}
      <div>
        <h1 className="tracking-wider uppercase">
          Order Details
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Order ID: {order._id}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          Ordered on{' '}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Order Status */}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Order Status
        </p>

        <p className="mt-2 text-lg font-medium capitalize">
          {order.orderStatus}
        </p>

        {/* Status Timeline */}
        <div className="mt-5 space-y-4">
          {order.statusHistory.map((history, index) => (
            <div
              key={`${history.status}-${history.timestamp}-${index}`}
              className="flex gap-3"
            >
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />

              <div>
                <p className="text-sm font-medium capitalize">
                  {history.status}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(history.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ordered Items */}
      <div className="mt-6">
        <h2 className="text-sm font-medium uppercase tracking-wider">
          Items
        </h2>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-20 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {item.color} · {item.size}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    Qty: {item.quantity}
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/products/${item.slug}`)}
                className="mt-4 text-sm font-medium underline underline-offset-4"
              >
                View Product
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider">
          Shipping Address
        </h2>

        <div className="mt-4 space-y-1 text-sm text-neutral-600">
          <p className="font-medium text-neutral-900">
            {order.shippingAddress.fullName}
          </p>

          <p>{order.shippingAddress.phone}</p>

          <p>{order.shippingAddress.address}</p>

          <p>
            {order.shippingAddress.city},{' '}
            {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider">
          Order Summary
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">
              Subtotal
            </span>

            <span>
              ₹{order.subtotal}
            </span>
          </div>

          <div className="flex justify-between border-t border-neutral-200 pt-3 font-medium">
            <span>Total</span>

            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider">
          Payment
        </h2>

        <p className="mt-3 text-sm capitalize">
          {order.paymentStatus}
        </p>
      </div>

      {/* Tracking */}
      {order.tracking && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider">
            Tracking
          </h2>

          <div className="mt-4 space-y-2 text-sm">
            {order.tracking.carrier && (
              <p>
                Carrier: {order.tracking.carrier}
              </p>
            )}

            {order.tracking.trackingNumber && (
              <p>
                Tracking Number: {order.tracking.trackingNumber}
              </p>
            )}

            {order.tracking.trackingUrl && (
              <a
                href={order.tracking.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 font-medium underline underline-offset-4"
              >
                Track Shipment
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default OrderDetails