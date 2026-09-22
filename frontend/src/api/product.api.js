import { apiClient } from './client'

const mapProduct = (product) => ({
  ...product,
  slug: product.seo?.slug,
  image: product.images?.[0]?.url,
})

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString()
  const response = await apiClient(`/products${query ? `?${query}` : ''}`)

  return {
    ...response,
    data: {
      ...response.data,
      products: response.data.products.map(mapProduct),
    },
  }
}

export function getProductBySlug(slug) {
  return apiClient(`/products/slug/${slug}`)
}

export function getProductById(id) {
  return apiClient(`/products/${id}`)
}