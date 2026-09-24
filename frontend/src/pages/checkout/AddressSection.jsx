import { useEffect, useState } from 'react'

import { Button } from '../../components/ui'
import {
  addAddress,
  getAddresses,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from '../../api/auth.api'

import {AddressCard, AddressForm} from './index'

function AddressSection({ user, token }) {
    
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

  const handleEditAddress = (savedAddress) => {
    setAddress(savedAddress)
    setEditingAddressId(savedAddress._id)
    setAddressError('')
    setIsAddressFormOpen(true)
  }

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
        console.error(error.message)
      }
    }

    if (token) {
      fetchAddresses()
    }
  }, [token])

  const handleCancelAddressForm = () => {
    setIsAddressFormOpen(false)
    setEditingAddressId(null)
    setAddressError('')
  }

  return (
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
            <AddressCard
              key={savedAddress._id}
              address={savedAddress}
              isSelected={
                selectedAddressId === savedAddress._id
              }
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefaultAddress}
            />
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
        <AddressForm
          address={address}
          editingAddressId={editingAddressId}
          onChange={handleAddressChange}
          onSubmit={handleAddressContinue}
          onCancel={handleCancelAddressForm}
        />
      )}

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
  )
}

export default AddressSection