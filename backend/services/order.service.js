import mongoose from "mongoose"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import { decreaseStock } from "./inventory.service.js"

async function createOrder(userId, orderData) {
  const { addressId, items } = orderData

  if (!mongoose.isValidObjectId(addressId)) {
    throw new Error("Invalid address")
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item")
  }

  const session = await mongoose.startSession()

  try {
    let createdOrder

    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session)

      if (!user) {
        throw new Error("User not found")
      }

      const address = user.addresses.id(addressId)

      if (!address) {
        throw new Error("Address not found")
      }

      const orderItems = []
      let subtotal = 0

      for (const item of items) {
        const { productId, variantId, quantity } = item

        if (!mongoose.isValidObjectId(productId)) {
          throw new Error("Invalid product")
        }

        if (!mongoose.isValidObjectId(variantId)) {
          throw new Error("Invalid variant")
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error("Quantity must be a positive integer")
        }

        const product = await Product.findOne({
          _id: productId,
          status: "active",
        }).session(session)

        if (!product) {
          throw new Error("Product not found")
        }

        const variant = product.variants.id(variantId)

        if (!variant) {
          throw new Error("Variant not found")
        }

        const itemTotal = product.price * quantity

        orderItems.push({
          product: product._id,
          variant: variant._id,
          name: product.name,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: product.price,
          quantity,
        })

        subtotal += itemTotal
      }

      for (const item of orderItems) {
        await decreaseStock(
          item.product,
          item.variant,
          item.quantity,
          session
        )
      }

      const orders = await Order.create(
        [
          {
            user: user._id,
            items: orderItems,
            shippingAddress: {
              fullName: address.fullName,
              phone: address.phone,
              address: address.address,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
            },
            subtotal,
            total: subtotal,
            statusHistory: [
              {
                status: "pending",
                timestamp: new Date(),
              },
            ],
          },
        ],
        { session }
      )

      createdOrder = orders[0]
    })

    return createdOrder
  } finally {
    await session.endSession()
  }
}

async function getUserOrders(userId) {
  const orders = await Order.find({
    user: userId,
  }).sort({ createdAt: -1 })

  return orders
}

export {
  createOrder,
  getUserOrders
}