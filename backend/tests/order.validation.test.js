import { describe, test, expect } from "vitest"
import mongoose from "mongoose"
import Order from "../models/Order.js"

describe("Order Model Validation", () => {
  const validOrder = {
    user: new mongoose.Types.ObjectId(),
    items: [
      {
        product: new mongoose.Types.ObjectId(),
        variant: new mongoose.Types.ObjectId(),
        name: "Classic Black T-Shirt",
        sku: "TS-BLK-M",
        color: "Black",
        size: "M",
        price: 999,
        quantity: 2,
      },
    ],
    shippingAddress: {
      fullName: "Sunny Pandey",
      phone: "9876543210",
      address: "123 Main Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    subtotal: 1998,
    total: 1998,
  }

  test("should validate a valid order", () => {
    const order = new Order(validOrder)

    expect(order.validateSync()).toBeUndefined()
  })

  test("should require user", () => {
    const order = new Order({
      ...validOrder,
      user: undefined,
    })

    expect(order.validateSync().errors.user).toBeDefined()
  })

  test("should require at least one item", () => {
    const order = new Order({
      ...validOrder,
      items: [],
    })

    expect(order.validateSync().errors.items).toBeDefined()
  })

  test("should reject invalid quantity", () => {
    const order = new Order({
      ...validOrder,
      items: [
        {
          ...validOrder.items[0],
          quantity: 0,
        },
      ],
    })

    expect(order.validateSync().errors["items.0.quantity"]).toBeDefined()
  })

  test("should reject negative price", () => {
    const order = new Order({
      ...validOrder,
      items: [
        {
          ...validOrder.items[0],
          price: -100,
        },
      ],
    })

    expect(order.validateSync().errors["items.0.price"]).toBeDefined()
  })

  test("should reject invalid payment status", () => {
    const order = new Order({
      ...validOrder,
      paymentStatus: "something-wrong",
    })

    expect(order.validateSync().errors.paymentStatus).toBeDefined()
  })

  test("should reject invalid order status", () => {
    const order = new Order({
      ...validOrder,
      orderStatus: "something-wrong",
    })

    expect(order.validateSync().errors.orderStatus).toBeDefined()
  })

  test("should reject invalid shipping pincode", () => {
    const order = new Order({
      ...validOrder,
      shippingAddress: {
        ...validOrder.shippingAddress,
        pincode: "12345",
      },
    })

    expect(order.validateSync().errors["shippingAddress.pincode"]).toBeDefined()
  })
})