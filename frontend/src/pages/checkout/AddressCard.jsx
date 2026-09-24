function AddressCard ({
  address,
  isSelected,
  onEdit,
  onDelete,
  onSetDefault,
}) {

    return (
    <div
      className={`border p-5 ${
        isSelected ? 'border-neutral-900' : 'border-neutral-200'
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <p className="font-medium">{address.fullName}</p>

            {address.isDefault && (
              <span className="text-xs uppercase tracking-wider text-neutral-500">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-neutral-600">
            {address.address}
          </p>

          <p className="text-neutral-600">
            {address.city}, {address.state} - {address.pincode}
          </p>

          <p className="mt-1 text-neutral-600">
            {address.phone}
          </p>
        </div>

        <div className="flex shrink-0 gap-3 text-sm">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="underline underline-offset-4"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(address._id)}
            className="text-red-600 underline underline-offset-4"
          >
            Delete
          </button>
        </div>
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={() => onSetDefault(address._id)}
          className="mt-4 text-sm underline underline-offset-4"
        >
          Use this address as default
        </button>
      )}
    </div>
  )
}

export default AddressCard;