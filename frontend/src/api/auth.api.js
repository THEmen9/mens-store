import { apiClient } from './client'

export function login(credentials) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(token) {
  return apiClient('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function register(userData) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export function addAddress(address, token) {
  return apiClient('/auth/addresses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  })
}

export function getAddresses(token) {
  return apiClient('/auth/addresses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export function updateAddress(addressId, address, token) {
  return apiClient(`/auth/addresses/${addressId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  })
}

export function setDefaultAddress(addressId, token) {
  return apiClient(`/auth/addresses/${addressId}/default`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function deleteAddress(addressId, token) {
  return apiClient(`/auth/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}