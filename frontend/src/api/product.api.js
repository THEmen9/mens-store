import { apiClient } from './client'

export function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString()

  return apiClient(`/products${query ? `?${query}` : ''}`)
}

export function getProductBySlug(slug) {
  return apiClient(`/products/slug/${slug}`)
}

export function getProductById(id) {
  return apiClient(`/products/${id}`)
}