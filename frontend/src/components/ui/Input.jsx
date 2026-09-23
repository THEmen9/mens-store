import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
  label,
  id: providedId,
  type = 'text',
  className = '',
  ...props
}, ref) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-900"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        className={`mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 ${className}`}
        {...props}
      />
    </div>
  )
})

export default Input;