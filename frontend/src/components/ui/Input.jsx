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
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        className={className}
        {...props}
      />
    </div>
  )
})

export default Input;