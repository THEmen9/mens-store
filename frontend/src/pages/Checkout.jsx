import { useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'

import { OrderSummary, AddressSection } from './checkout/index'

function Checkout() { 
  const { cartItems } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (cartItems.length === 0) {
    return (
      <main className="px-4 py-16 md:px-8 lg:px-12">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Checkout
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">
            Your cart is empty
          </h1>

          <p className="mt-4 text-sm text-neutral-500">
            Add some products to your cart before continuing to checkout.
          </p>

          <div className="mt-8">
            <Button type="button" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </section>
      </main>
    )
  }
  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Checkout
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Complete Your Order
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Customer */}
            <section className="border-t pt-6">
              <h2 className="text-lg font-medium">
                Customer
              </h2>
               <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Name
                  </p>
                  <p className="mt-1 text-sm">
                    {user?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm">
                    {user?.email}
                  </p>
                </div>
              </div>
            </section>

            {/* Address */}
            <AddressSection
              user={user}
              token={token}
            />
          </div>

          {/* Order Summary */}
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
          />
        </div>
      </section>
    </main>
  )
}

export default Checkout;

