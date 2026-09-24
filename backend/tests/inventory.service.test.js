import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"
import { decreaseStock, increaseStock } from "../services/inventory.service.js"
import Product from "../models/Product.js"

vi.mock("../models/Product.js", () => ({
  default: {
    findOneAndUpdate: vi.fn(),
  },
}))

describe("Inventory Service", () => {
  const productId = new mongoose.Types.ObjectId()
  const variantId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should decrease stock", async () => {
    const updatedProduct = {
      _id: productId,
      variants: [
        {
          _id: variantId,
          stock: 8,
        },
      ],
    }

    Product.findOneAndUpdate.mockResolvedValue(updatedProduct)

    const result = await decreaseStock(productId, variantId, 2)

    expect(Product.findOneAndUpdate).toHaveBeenCalledOnce()
    expect(result).toEqual(updatedProduct)
  })

  test("should reject when stock is insufficient", async () => {
    Product.findOneAndUpdate.mockResolvedValue(null)

    await expect(
      decreaseStock(productId, variantId, 20),
    ).rejects.toThrow("Insufficient stock or variant not found")
  })

  test("should increase stock", async () => {
    const updatedProduct = {
      _id: productId,
      variants: [
        {
          _id: variantId,
          stock: 15,
        },
      ],
    }

    Product.findOneAndUpdate.mockResolvedValue(updatedProduct)

    const result = await increaseStock(productId, variantId, 5)

    expect(Product.findOneAndUpdate).toHaveBeenCalledOnce()
    expect(result).toEqual(updatedProduct)
  })

  test("should reject invalid increase quantity", async () => {
    await expect(
      increaseStock(productId, variantId, 0),
    ).rejects.toThrow("Quantity must be a positive integer")

    expect(Product.findOneAndUpdate).not.toHaveBeenCalled()
  })

  test("should reject negative increase quantity", async () => {
    await expect(
      increaseStock(productId, variantId, -5),
    ).rejects.toThrow("Quantity must be a positive integer")

    expect(Product.findOneAndUpdate).not.toHaveBeenCalled()
  })

  test("should reject when product or variant does not exist", async () => {
    Product.findOneAndUpdate.mockResolvedValue(null)

    await expect(
      increaseStock(productId, variantId, 5),
    ).rejects.toThrow("Product or variant not found")
  })
})