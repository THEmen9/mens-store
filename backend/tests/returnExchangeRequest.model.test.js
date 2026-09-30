import { describe, expect, it } from "vitest"
import mongoose from "mongoose"
import ReturnExchangeRequest from "../models/ReturnExchangeRequest.js"

describe("ReturnExchangeRequest model", () => {
  const validData = {
    user: new mongoose.Types.ObjectId(),
    order: new mongoose.Types.ObjectId(),
    orderItem: new mongoose.Types.ObjectId(),
    type: "return",
    quantity: 1,
    reason: "size_issue",
  }

  it("should create a valid return request", () => {
    const request = new ReturnExchangeRequest(validData)

    const error = request.validateSync()

    expect(error).toBeUndefined()
    expect(request.status).toBe("requested")
  })

  it("should create a valid exchange request", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      type: "exchange",
      exchangeVariant: new mongoose.Types.ObjectId(),
    })

    const error = request.validateSync()

    expect(error).toBeUndefined()
  })

  it("should reject invalid request type", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      type: "refund",
    })

    const error = request.validateSync()

    expect(error.errors.type).toBeDefined()
  })

  it("should reject invalid reason", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      reason: "invalid_reason",
    })

    const error = request.validateSync()

    expect(error.errors.reason).toBeDefined()
  })

  it("should reject quantity less than 1", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      quantity: 0,
    })

    const error = request.validateSync()

    expect(error.errors.quantity).toBeDefined()
  })

  it("should reject non-integer quantity", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      quantity: 1.5,
    })

    const error = request.validateSync()

    expect(error.errors.quantity).toBeDefined()
  })

  it("should reject invalid status", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      status: "cancelled",
    })

    const error = request.validateSync()

    expect(error.errors.status).toBeDefined()
  })

  it("should validate proof type", () => {
    const request = new ReturnExchangeRequest({
      ...validData,
      proof: [
          {
              url: "https://example.com/proof.jpg",
              type: "image",
              publicId: "return-exchange/proof-123",
              resourceType: "image",
          },
      ],
    })

    const error = request.validateSync()

    expect(error).toBeUndefined()
  })
})