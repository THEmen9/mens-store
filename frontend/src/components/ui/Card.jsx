import React from "react";
const Card = React.forwardRef(function Card({
  children,
  className = '',
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      className={`overflow-hidden border bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

export default Card;