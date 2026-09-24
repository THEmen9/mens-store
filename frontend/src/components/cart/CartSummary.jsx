import { useCart } from '../../context/CartContext'
import { Button } from '../ui';
import { Navigate, useNavigate } from 'react-router-dom';

function CartSummary() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

  return (
    <aside className="border-t pt-6 lg:border-t-0 lg:border-l lg:pl-8">
      <div className="h-5 w-24 bg-neutral-100" />

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">
              Subtotal
            </span>

            <span className="text-sm font-medium">
              ₹{subtotal}
            </span>
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          <div className="flex justify-between border-t pt-4">
            <span className="text-base font-medium">
              Total
            </span>

            <span className="text-base font-medium">
              ₹{subtotal}
            </span>
          </div>
        </div>
      </div>

     <Button
      onClick={() => navigate('/checkout')}
      disabled={cartItems.length === 0}
      className="mt-6 w-full bg-black px-4 py-3 text-sm font-medium text-white 
      disabled:cursor-not-allowed disabled:opacity-40"
    >
      Proceed to Checkout
    </Button>
    </aside>
  )
}

export default CartSummary