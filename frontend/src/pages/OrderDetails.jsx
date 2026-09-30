import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import {
  getOrderById,
  getReturnExchangeRequestsByOrder,
  getReturnExchangeEligibility,
  cancelOrder
} from '../api/order.api'

import {
  ReturnRequestDetails,
  ExchangeRequestDetails,
  ReturnExchangeEligibility
} from '../components/order/return-exchange/index'

function OrderDetails() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [returnExchangeRequests, setReturnExchangeRequests] = useState([]);
  // Stores backend-authoritative Return/Exchange eligibility for each order item.
  const [returnExchangeEligibility, setReturnExchangeEligibility] = useState([]);
// ----------------------------------------------
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getOrderById(id, token)

        setOrder(response.data)

        // Fetch return/exchange requests only after the order is confirmed.
        const returnExchangeResponse =
          await getReturnExchangeRequestsByOrder(id, token)

        setReturnExchangeRequests(
          returnExchangeResponse.data.requests
        )
        // Fetch eligibility only after the order is confirmed.
        const eligibilityResponse =
          await getReturnExchangeEligibility(id, token)

        setReturnExchangeEligibility(
          eligibilityResponse.data.eligibility
        )

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
// ------------------------------------------------
  const handleCancelOrder = async () => {
    try {
      setError(null)

      // Backend remains the final authority for cancellation eligibility.
      await cancelOrder(order._id, token)

      // Refresh the order so UI reflects the backend-authoritative state.
      const response = await getOrderById(order._id, token)
      setOrder(response.data)
    } catch (error) {
      setError(error.message)
    }
  }
// -----------------------------------------------------
  if (isLoading) {
    return <div className="py-6">Loading order...</div>
  }

  if (error) {
    return <div className="py-6">{error}</div>
  }

  if (!order) {
    return <div className="py-6">Order not found.</div>
  }
// ---------------------------------------------------
  const createdAt = new Date(order?.createdAt)
  const cancelDeadline = new Date(
    createdAt.getTime() + 24 * 60 * 60 * 1000
  )

  const cancellableStatuses = [
    'pending',
    'confirmed',
    'processing',
  ]

  const canCancel =
    order &&
    new Date() < cancelDeadline &&
    cancellableStatuses.includes(order.orderStatus)
  // --------------------------------------------------
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
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Order Status
            </p>

            <p className="mt-2 text-lg font-medium capitalize">
              {order.orderStatus.replaceAll('_', ' ')}
            </p>
          </div>
        </div>

        {/* Responsive horizontal order timeline */}
        <div className="mt-8 w-full">
          <div className="flex items-start justify-between">
            {[
              { label: 'Ordered', statuses: ['pending', 'confirmed', 'processing'] },
              { label: 'Shipped', statuses: ['shipped'] },
              { label: 'Out for delivery', statuses: ['out_for_delivery'] },
              { label: 'Delivered', statuses: ['delivered'] },
            ].map((stage, index, stages) => {
              const statusOrder = [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'out_for_delivery',
                'delivered',
              ]

              const currentIndex = statusOrder.indexOf(order.orderStatus)
              const stageIndex = statusOrder.indexOf(stage.statuses[0])

              const isCompleted =
                currentIndex !== -1 && currentIndex >= stageIndex

              return (
                <div
                  key={stage.label}
                  className="flex min-w-0 flex-1 items-start"
                >
                  <div className="flex min-w-0 flex-1 flex-col items-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border 
                        text-xs font-medium ${
                        isCompleted
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 bg-white text-neutral-400'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    <p
                      className={`mt-2 text-center text-[11px] leading-4 sm:text-xs ${
                        isCompleted
                          ? 'font-medium text-neutral-900'
                          : 'text-neutral-400'
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>

                  {/* Connector between timeline stages */}
                  {index < stages.length - 1 && (
                    <div
                      className={`mt-3 h-px flex-1 ${
                        isCompleted
                          ? 'bg-black'
                          : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Track Order belongs to the status section */}
        {order.tracking?.trackingUrl && (
          <a
            href={order.tracking.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
          >
            Track Order
          </a>
        )}
      </div>

      {/* Ordered Items */}
      <div className="mt-6">
        <h2 className="text-sm font-medium uppercase tracking-wider">
          Items
        </h2>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => {
            // Find backend-calculated eligibility for this exact order item.
            const itemEligibility = returnExchangeEligibility.find(
              (eligibility) => eligibility.orderItemId === item._id
            ) 
            return (
            <article
              key={item._id}
              className="rounded-2xl border border-neutral-200 bg-white p-4"
              >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                {/* Product information */}
                <div className="flex min-w-0 gap-4 sm:flex-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0">
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

                {/* Item actions */}
                <div className="flex flex-wrap items-center gap-4 sm:w-48 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${item.slug}`)}
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    View Product
                  </button>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      className="text-sm font-medium text-neutral-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Backend-authoritative Return/Exchange eligibility */}
              <ReturnExchangeEligibility
                eligibility={itemEligibility}
                productId={item.product}
              />

              {/* Return requests belonging to this exact order item */}
              {returnExchangeRequests
                .filter(
                  (request) =>
                    request.orderItem === item._id &&
                    request.type === 'return'
                )
                .map((request) => (
                  <ReturnRequestDetails
                    key={request._id}
                    request={request}
                    item={item}
                  />
                ))}
                {/* Exchange requests belonging to this exact order item */}
                {returnExchangeRequests
                  .filter(
                    (request) =>
                      request.orderItem === item._id &&
                      request.type === 'exchange'
                  )
                  .map((request) => (
                    <ExchangeRequestDetails
                      key={request._id}
                      request={request}
                      item={item}
                    />
                  ))}
                </article>
              )
            })}
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
          </div>
        </div>
      )}
    </section>
  )
}

export default OrderDetails