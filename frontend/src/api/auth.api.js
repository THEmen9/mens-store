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