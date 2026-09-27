import { useEffect, useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { cancelOrder, getUserOrders } from '../api/order.api'
import OrderCard from "../components/order/OrderCard"

function MyOrders() {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
        console.log('ORDERS RESPONSE:', response)
        setOrders(response.data.orders)
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

        <div className='space-y-6'>
          {orders.map((order) => (
            <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
            />
        ))}
        </div>
      </section>
  )
}

export default MyOrders