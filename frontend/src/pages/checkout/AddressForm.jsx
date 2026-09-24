import { Input, Button } from '../../components/ui'

function AddressForm({
  address,
  editingAddressId,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="mt-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Full Name"
          name="fullName"
          value={address.fullName}
          onChange={onChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={address.phone}
          onChange={onChange}
          placeholder="10-digit phone number"
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Address"
            name="address"
            value={address.address}
            onChange={onChange}
            placeholder="House no., street, area"
            required
          />
        </div>

        <Input
          label="City"
          name="city"
          value={address.city}
          onChange={onChange}
          required
        />

        <Input
          label="State"
          name="state"
          value={address.state}
          onChange={onChange}
          required
        />

        <Input
          label="Pincode"
          name="pincode"
          inputMode="numeric"
          value={address.pincode}
          onChange={onChange}
          placeholder="6-digit pincode"
          required
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={onSubmit}>
          {editingAddressId ? 'Save Changes' : 'Save Address'}
        </Button>

        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default AddressForm;