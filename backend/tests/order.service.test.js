import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"
import { createOrder } from "../services/order.service.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import { decreaseStock } from "../services/inventory.service.js"

vi.spyOn(mongoose, "startSession").mockResolvedValue({
  withTransaction: vi.fn(async (callback) => {
    await callback()
  }),
  endSession: vi.fn().mockResolvedValue(),
})

vi.mock("../models/Order.js", () => ({
  default: {
    create: vi.fn(),
  },
}))

vi.mock("../models/Product.js", () => ({
  default: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}))

vi.mock("../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}))

vi.mock("../services/inventory.service.js", () => ({
  decreaseStock: vi.fn().mockResolvedValue({
    _id: new mongoose.Types.ObjectId(),
  }),
}))

describe("Order Service - createOrder", () => {
  const userId = new mongoose.Types.ObjectId()
  const addressId = new mongoose.Types.ObjectId()
  const productId = new mongoose.Types.ObjectId()
  const variantId = new mongoose.Types.ObjectId()

  const address = {
    _id: addressId,
    fullName: "Sunny Pandey",
    phone: "9876543210",
    address: "123 Main Street",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
  }

  const variant = {
    _id: variantId,
    sku: "TS-BLK-M",
    color: "Black",
    size: "M",
    stock: 10,
  }

  const product = {
    _id: productId,
    name: "Classic Black T-Shirt",
    price: 999,
    variants: {
      id: vi.fn(() => variant),
    },
  }

  const createUserQuery = (user) => ({
    session: vi.fn().mockResolvedValue(user),
  })

  const createProductQuery = (productValue) => ({
    session: vi.fn().mockResolvedValue(productValue),
  })

  beforeEach(() => {
    vi.clearAllMocks()

    User.findById.mockReturnValue(createUserQuery({
      _id: userId,
      addresses: {
        id: vi.fn(() => address),
      },
    }))

    Product.findOne.mockReturnValue(createProductQuery(product))

    Order.create.mockResolvedValue([
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        subtotal: 1998,
        total: 1998,
      },
    ])
  })

  test("should create an order with server-calculated total", async () => {
    const order = await createOrder(userId.toString(), {
      addressId: addressId.toString(),
      items: [
        {
          productId: productId.toString(),
          variantId: variantId.toString(),
          quantity: 2,
        },
      ],
    })

    expect(Order.create).toHaveBeenCalledOnce()

    const createdOrder = Order.create.mock.calls[0][0][0]

    expect(createdOrder.user).toEqual(userId)
    expect(createdOrder.subtotal).toBe(1998)
    expect(createdOrder.total).toBe(1998)
    expect(createdOrder.items[0].price).toBe(999)

    expect(order).toBeDefined()
  })

  test("should reject invalid address id", async () => {
    await expect(
      createOrder(userId.toString(), {
        addressId: "invalid-id",
        items: [],
      }),
    ).rejects.toThrow("Invalid address")

    expect(User.findById).not.toHaveBeenCalled()
  })

  test("should reject empty items", async () => {
    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [],
      }),
    ).rejects.toThrow("Order must contain at least one item")
  })

  test("should reject when user does not exist", async () => {
    User.findById.mockReturnValue(createUserQuery(null))

    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [
          {
            productId: productId.toString(),
            variantId: variantId.toString(),
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow("User not found")
  })

  test("should reject when address does not belong to user", async () => {
    User.findById.mockReturnValue(
      createUserQuery({
        _id: userId,
        addresses: {
          id: vi.fn(() => null),
        },
      }),
    )

    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [
          {
            productId: productId.toString(),
            variantId: variantId.toString(),
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow("Address not found")
  })

  test("should reject invalid quantity", async () => {
    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [
          {
            productId: productId.toString(),
            variantId: variantId.toString(),
            quantity: 0,
          },
        ],
      }),
    ).rejects.toThrow("Quantity must be a positive integer")
  })

  test("should reject unavailable product", async () => {
    Product.findOne.mockReturnValue(createProductQuery(null))

    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [
          {
            productId: productId.toString(),
            variantId: variantId.toString(),
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow("Product not found")
  })

  test("should reject insufficient stock", async () => {
    Product.findOne.mockReturnValue(
      createProductQuery({
        ...product,
        variants: {
          id: vi.fn(() => ({
            ...variant,
            stock: 1,
          })),
        },
      }),
    )

    decreaseStock.mockRejectedValueOnce(
      new Error("Insufficient stock or variant not found")
    )

    await expect(
      createOrder(userId.toString(), {
        addressId: addressId.toString(),
        items: [
          {
            productId: productId.toString(),
            variantId: variantId.toString(),
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow("Insufficient stock or variant not found")
  })
})