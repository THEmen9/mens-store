const API_URL = import.meta.env.VITE_API_URL

export async function apiClient(endpoint, options = {}) {
  // Detect whether this request is sending files through FormData.
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      // Browser ko multipart boundary automatically generate karne do.
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}