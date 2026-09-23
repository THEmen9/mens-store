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