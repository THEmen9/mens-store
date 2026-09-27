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