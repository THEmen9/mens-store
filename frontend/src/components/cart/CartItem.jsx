import { useCart } from '../../context/CartContext'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { Button } from '../ui';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart  } = useCart();

  return (
    <article className="flex gap-4 border-b pb-6">
      <div className="h-32 w-24 overflow-hidden shrink-0 bg-neutral-100 md:h-40 md:w-32">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>


      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="font-medium">
            {item.name}
        </h2>
         <p className="mt-2 text-sm text-neutral-500">
          {item.color} / {item.size}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          {/* quantity */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center border text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
             <FiMinus size={14} />
            </Button>

            <span className="min-w-4 text-center text-sm">
              {item.quantity}
            </span>

            <Button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center border text-sm"
            >
             <FiPlus size={14} />
            </Button>
            <Button
              onClick={() => removeFromCart(item.variantId)}
              className="ml-2 text-sm text-neutral-500 underline underline-offset-4 hover:text-black"
            >
              Remove
            </Button>
          </div>
          <p className="text-sm font-medium">
            ₹{item.price}
          </p>
        </div>
      </div>
    </article>
  )
}

export default CartItem;