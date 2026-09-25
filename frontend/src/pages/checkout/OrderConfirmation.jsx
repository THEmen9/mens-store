import { Button } from "../../components/ui"
import { useNavigate } from "react-router-dom"

function OrderConfirmation({ order }) {
  const navigate = useNavigate()

  return (
    <section className="px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-xl text-center">

        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Order Confirmation
        </p>

        <h2 className="mt-3 text-3xl font-medium tracking-wide md:text-5xl">
          Order placed successfully
        </h2>

        <p className="mt-4 text-sm text-neutral-500">
          Thank you for choosing men's-store. Have a good day and happy shopping!
        </p>

        <div className="mt-8 border-y py-6 text-left">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-neutral-500">
              Order ID
            </span>

            <span className="text-sm font-medium break-all">
              {order?._id}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Total
            </span>

            <span className="text-sm font-medium">
              ₹{order?.total}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Button
            type="button"
            disabled
          >
            View Order
          </Button>

          <Button
            type="button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>

        </div>
      </div>
    </section>
  )
}

export default OrderConfirmation