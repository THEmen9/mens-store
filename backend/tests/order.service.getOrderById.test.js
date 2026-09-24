import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"
import { getOrderById } from "../services/order.service.js"
import Order from "../models/Order.js"

vi.mock("../models/Order.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}))

describe("Order Service - getOrderById", () => {
  const userId = new mongoose.Types.ObjectId()
  const orderId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return user's order", async () => {
    const order = {
      _id: orderId,
      user: userId,
      total: 999,
    }

    Order.findOne.mockResolvedValue(order)

    const result = await getOrderById(
      userId.toString(),
      orderId.toString(),
    )

    expect(Order.findOne).toHaveBeenCalledWith({
      _id: orderId.toString(),
      user: userId.toString(),
    })

    expect(result).toEqual(order)
  })

  test("should reject invalid order id", async () => {
    await expect(
      getOrderById(userId.toString(), "invalid-id"),
    ).rejects.toThrow("Invalid order id")

    expect(Order.findOne).not.toHaveBeenCalled()
  })

  test("should reject when order does not belong to user", async () => {
    Order.findOne.mockResolvedValue(null)

    await expect(
      getOrderById(
        userId.toString(),
        orderId.toString(),
      ),
    ).rejects.toThrow("Order not found")

    expect(Order.findOne).toHaveBeenCalledWith({
      _id: orderId.toString(),
      user: userId.toString(),
    })
  })
})