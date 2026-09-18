function Container({ children, className = '', ...props }) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container;