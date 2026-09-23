import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/ui'
import {
  addAddress,
  getAddresses,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from '../api/auth.api'

function Checkout() {
  const { cartItems } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [savedAddresses, setSavedAddresses] = useState([])
  const [addressError, setAddressError] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)

  const handleAddressChange = (event) => {
    const { name, value } = event.target

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
// Validation-handler
  const handleAddressContinue = async () => {
    setAddressError('')
    setAddressSaved(false)

    const requiredFields = [
      'fullName',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
    ]

    const hasEmptyField = requiredFields.some(
      (field) => !address[field].trim()
    )

    if (hasEmptyField) {
      setAddressError('Please fill in all address fields.')
      return
    }

    if (!/^\d{10}$/.test(address.phone)) {
      setAddressError('Please enter a valid 10-digit phone number.')
      return
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setAddressError('Please enter a valid 6-digit pincode.')
      return
    }

    try {
      if (editingAddressId) {
        const response = await updateAddress(
          editingAddressId,
          address,
          token
        )

        const updatedAddress = response.data.address

        setSavedAddresses((prev) =>
          prev.map((item) =>
            item._id === updatedAddress._id
              ? updatedAddress
              : item
          )
        )

        setAddress(updatedAddress)
      } else {
        const response = await addAddress(address, token)

        const newAddress = response.data.address

        setSavedAddresses((prev) => [...prev, newAddress])

        if (newAddress.isDefault) {
          setSelectedAddressId(newAddress._id)
        }
      }

      setIsAddressFormOpen(false)
      setEditingAddressId(null)
      setAddressSaved(true)

      setTimeout(() => {
        setAddressSaved(false)
      }, 1500)
    } catch (error) {
      setAddressError(error.message)
    }
  }
// handle-address
  const handleAddAddress = () => {
    setAddress({
      fullName: user?.name || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    })

    setEditingAddressId(null)
    setAddressError('')
    setIsAddressFormOpen(true)
  }
// handle-edit-address
  const handleEditAddress = (savedAddress) => {
    setAddress(savedAddress)
    setEditingAddressId(savedAddress._id)
    setAddressError('')
    setIsAddressFormOpen(true)
  }
// handel-default-address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      setAddressError('')

      await setDefaultAddress(addressId, token)

      const response = await getAddresses(token)
      const addresses = response.data.addresses

      setSavedAddresses(addresses)

      if (addresses.length > 0) {
        const defaultAddress =
          addresses.find((item) => item.isDefault) || addresses[0]

        setSelectedAddressId(defaultAddress._id)
        setAddress(defaultAddress)
      }
    } catch (error) {
      setAddressError(error.message)
    }
  }
// handle-delete-address
  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm('Delete this address?')

    if (!confirmed) return

    try {
      setAddressError('')

      await deleteAddress(addressId, token)

      const response = await getAddresses(token)
      const addresses = response.data.addresses

      setSavedAddresses(addresses)

      if (addresses.length > 0) {
        const defaultAddress =
          addresses.find((item) => item.isDefault) || addresses[0]

        setSelectedAddressId(defaultAddress._id)
        setAddress(defaultAddress)
      } else {
        setSelectedAddressId(null)
        setAddress({
          fullName: user?.name || '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
        })
      }
    } catch (error) {
      setAddressError(error.message)
    }
  }

  useEffect(() => {
    const fetchAddresses = async () => {
      try {

        const response = await getAddresses(token);
        const addresses = response.data.addresses;

        setSavedAddresses(addresses)

        if (addresses.length > 0) {
          const defaultAddress =
          addresses.find((item) => item.isDefault) || addresses[0]

          setSelectedAddressId(defaultAddress._id)
          setAddress(defaultAddress)
          }
      } catch (error) {
        console.error(error.message)
      }
    }

    if (token) {
      fetchAddresses()
    }
  }, [token])

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
            <section className="border-t pt-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-medium">
                  Delivery Address
                </h2>

                {savedAddresses.length > 0 && !isAddressFormOpen && (
                  <Button
                    type="button"
                    onClick={handleAddAddress}
                  >
                    Add New Address
                  </Button>
                )}
              </div>

              {savedAddresses.length > 0 && !isAddressFormOpen && (
                <div className="mt-6 space-y-4">
                  {savedAddresses.map((savedAddress) => (
                    <div
                      key={savedAddress._id}
                      className={`border p-5 ${
                        selectedAddressId === savedAddress._id
                          ? 'border-neutral-900'
                          : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {savedAddress.fullName}
                            </p>

                            {savedAddress.isDefault && (
                              <span className="text-xs uppercase tracking-wider
                              text-neutral-500">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-neutral-600">
                            {savedAddress.address}
                          </p>

                          <p className="text-neutral-600">
                            {savedAddress.city}, {savedAddress.state} -{' '}
                            {savedAddress.pincode}
                          </p>

                          <p className="mt-1 text-neutral-600">
                            {savedAddress.phone}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-3 text-sm">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditAddress(savedAddress)
                            }
                            className="underline underline-offset-4"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAddress(savedAddress._id)
                            }
                            className="text-red-600 underline underline-offset-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {!savedAddress.isDefault && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSetDefaultAddress(savedAddress._id)
                          }
                          className="mt-4 text-sm underline underline-offset-4"
                        >
                          Use this address as default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {savedAddresses.length === 0 && !isAddressFormOpen && (
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleAddAddress}
                  >
                    Add New Address
                  </Button>
                </div>
              )}

              {isAddressFormOpen && (
                <>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <Input
                    label="Full Name"
                    name="fullName"                   
                    value={address.fullName}
                    onChange={handleAddressChange}
                    required
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit phone number"
                    required
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      name="address"
                      value={address.address}
                      onChange={handleAddressChange}
                      placeholder="House no., street, area"
                      required
                    />
                  </div>

                  <Input
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    inputMode="numeric"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    required
                  />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      type="button"
                      onClick={handleAddressContinue}
                    >
                      {editingAddressId ? 'Save Changes' : 'Save Address'}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        setIsAddressFormOpen(false)
                        setEditingAddressId(null)
                        setAddressError('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Order Summary */}
          <aside className="border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8">
            <h2 className="text-lg font-medium">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        {addressError && (
          <p className="mt-4 text-sm text-red-600">
            {addressError}
          </p>
        )}

        {addressSaved && (
          <p className="mt-4 text-sm text-green-700">
            Delivery address saved.
          </p>
        )}
      </section>
    </main>
  )
}

export default Checkout;

