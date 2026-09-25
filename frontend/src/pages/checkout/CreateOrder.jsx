import { Button } from '../../components/ui'
import { createOrder } from '../../api/order.api'
import { useState } from 'react'

function CreateOrder({
  cartItems,
  selectedAddressId,
  token,
  onOrderCreated
}) {

    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    

    const handleCreateOrder = async () => {

        if (!selectedAddressId || isCreatingOrder) {
            return
        }

        const orderData = {
            addressId: selectedAddressId,
            items: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            })),
        }

        try {
        setIsCreatingOrder(true)
        const response = await createOrder(orderData, token)
        onOrderCreated(response.data)
        console.log(response)
        } catch (error) {
            console.error(error.message)
        }finally {
        setIsCreatingOrder(false)
        }
    }
  return (
    <div className="mt-6">
      <Button
        type="button"
        onClick={handleCreateOrder}
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? 'Creating Order...' : 'Place Order'}
      </Button>
    </div>
  )
}

export default CreateOrder