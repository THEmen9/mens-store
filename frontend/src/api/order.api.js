import { apiClient } from './client'

export function createOrder(orderData, token) {
  return apiClient('/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })
}

export function getUserOrders(token) {
  return apiClient('/orders' , {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${token}`,
    },
  })
}

export function cancelOrder(orderId, token) {
  return apiClient(`/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function getOrderById(orderId, token) {
  return apiClient(`/orders/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Fetches return/exchange requests associated with a specific order.
export function getReturnExchangeRequestsByOrder(orderId, token) {
  return apiClient(`/returns-exchanges/order/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Fetches all return/exchange requests belonging to the authenticated user.
export function getUserReturnExchangeRequests(token) {
  return apiClient('/returns-exchanges/my', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}