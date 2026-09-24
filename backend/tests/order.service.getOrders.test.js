import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"
import { getUserOrders } from "../services/order.service.js"
import Order from "../models/Order.js"

vi.mock("../models/Order.js", () => ({
  default: {
    find: vi.fn(),
  },
}))

describe("Order Service - getUserOrders", () => {
  const userId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return user's orders sorted by newest", async () => {
    const orders = [
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        total: 1998,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        total: 999,
      },
    ]

    const sort = vi.fn().mockResolvedValue(orders)

    Order.find.mockReturnValue({
      sort,
    })

    const result = await getUserOrders(userId.toString())

    expect(Order.find).toHaveBeenCalledWith({
      user: userId.toString(),
    })

    expect(sort).toHaveBeenCalledWith({
      createdAt: -1,
    })

    expect(result).toEqual(orders)
  })

  test("should return empty array when user has no orders", async () => {
    const sort = vi.fn().mockResolvedValue([])

    Order.find.mockReturnValue({
      sort,
    })

    const result = await getUserOrders(userId.toString())

    expect(result).toEqual([])
  })

  test("should return only orders belonging to the requested user", async () => {
    const orders = [
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        total: 999,
      },
    ]

    const sort = vi.fn().mockResolvedValue(orders)

    Order.find.mockReturnValue({
      sort,
    })

    await getUserOrders(userId.toString())

    expect(Order.find).toHaveBeenCalledWith({
      user: userId.toString(),
    })
  })
})