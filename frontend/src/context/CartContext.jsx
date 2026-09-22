import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item) => {
    if (
      !item.productId ||
      !item.variantId ||
      !item.quantity ||
      !item.name ||
      !item.color ||
      !item.size
    ) {
      return
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.variantId === item.variantId
      )

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.variantId === item.variantId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        )
      }

      return [...currentItems, item]
    })
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}