import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart')

    return savedCart ? JSON.parse(savedCart) : []
  })

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
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity < 1) return

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
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