import Product from "../models/Product.js"

const decreaseStock = async (productId, variantId, quantity, session = null) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      status: "active",
      variants: {
        $elemMatch: {
          _id: variantId,
          stock: { $gte: quantity },
        },
      },
    },
    {
      $inc: {
        "variants.$.stock": -quantity,
      },
    },
    {
      new: true,
      ...(session && { session }),
    }
  )

  if (!product) {
    throw new Error("Insufficient stock or variant not found")
  }

  return product
}

const increaseStock = async (productId, variantId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer")
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      $inc: {
        "variants.$.stock": quantity,
      },
    },
    {
      new: true,
    }
  )

  if (!product) {
    throw new Error("Product or variant not found")
  }

  return product
}

export {
  decreaseStock,
  increaseStock,
}