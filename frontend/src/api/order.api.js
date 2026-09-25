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