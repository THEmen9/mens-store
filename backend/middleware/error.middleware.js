const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const errors = Object.entries(error.keyValue || {}).map(
      ([field, value]) => ({
        field,
        message: `${field} already exists`,
      })
    );

    return res.status(409).json({
      success: false,
      message: "Product could not be created",
      errors,
    });
  }

  //   Custom error with statusCode and errors
  if (error.statusCode && error.errors) {
  return res.status(error.statusCode).json({
    success: false,
    message: "Validation failed",
    errors: error.errors,
  });
}
  // Unexpected error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;