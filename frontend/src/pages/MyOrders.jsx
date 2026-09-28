import { useEffect, useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { cancelOrder, getUserOrders, getUserReturnExchangeRequests} from '../api/order.api'
import OrderCard from "../components/order/OrderCard"

function MyOrders() {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stores all return/exchange requests for the authenticated user.
  const [returnExchangeRequests, setReturnExchangeRequests] = useState([])

  // Controls which order section is currently visible.
  const [activeFilter, setActiveFilter] = useState("all")

  const handleCancelOrder = async (orderId) => {
    try {
      setError(null)

      const response = await cancelOrder(orderId, token)

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? response.data
            : order
        )
      )
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getUserOrders(token)
        setOrders(response.data.orders)

        const returnExchangeResponse =
        await getUserReturnExchangeRequests(token)

        setReturnExchangeRequests(
          returnExchangeResponse.data.requests
        )
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    if (token) {
      fetchOrders()
    }
  }, [token])

  // Filters orders based on the selected My Orders section.
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") {
      return true
    }

    if (activeFilter === "cancelled") {
      return order.orderStatus === "cancelled"
    }

    return returnExchangeRequests.some(
      (request) =>
        request.order === order._id &&
        request.type === activeFilter
    )
  })

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>
  }

  return (
      <section className='py-6'>
        <h1 className='py-4 tracking-wider uppercase'>Your Orders</h1>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-neutral-200">
          {[
            { value: "all", label: "All" },
            { value: "cancelled", label: "Cancelled" },
            { value: "return", label: "Returns" },
            { value: "exchange", label: "Exchanges" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 px-3 py-2 text-sm ${
                activeFilter === filter.value
                  ? "border-b-2 border-black font-medium"
                  : "text-neutral-500"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className='space-y-6'>
          {filteredOrders.map((order) => (
            <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
                returnExchangeRequests={returnExchangeRequests}
            />
        ))}
        </div>
      </section>
  )
}

export default MyOrders