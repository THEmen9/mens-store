import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"

import { createReturnExchangeRequest } from "../services/returnExchange.service.js"
import Order from "../models/Order.js"
import ReturnExchangeRequest from "../models/ReturnExchangeRequest.js"
import Product from "../models/Product.js"

// Mock database models so this suite focuses on service/business logic.
vi.mock("../models/ReturnExchangeRequest.js", () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock("../models/Order.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}))

vi.mock("../models/Product.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}))

describe("createReturnExchangeRequest", () => {
  const userId = new mongoose.Types.ObjectId()
  const orderId = new mongoose.Types.ObjectId()
  const orderItemId = new mongoose.Types.ObjectId()
  const productId = new mongoose.Types.ObjectId()
  const exchangeVariantId = new mongoose.Types.ObjectId()

  const createRequestData = (overrides = {}) => ({
    orderId,
    orderItemId,
    type: "return",
    quantity: 1,
    reason: "size_issue",
    ...overrides,
  })

  const createOrderItem = (overrides = {}) => ({
    _id: orderItemId,
    product: productId,
    quantity: 2,
    ...overrides,
  })

  const createOrder = (overrides = {}) => ({
    _id: orderId,
    user: userId,
    orderStatus: "delivered",

    // Delivery timestamp is required for the 7-day return window.
    statusHistory: [
      {
        status: "delivered",
        timestamp: new Date(),
      },
    ],

    // Simulate Mongoose's document-array id() helper.
    items: {
      id: vi.fn(() => createOrderItem()),
    },

    ...overrides,
  })

  const createProduct = (variant = { _id: exchangeVariantId }) => ({
    _id: productId,
    status: "active",

    // Simulate Mongoose's subdocument lookup.
    variants: {
      id: vi.fn(() => variant),
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()

    Order.findOne.mockResolvedValue(createOrder())

    // No existing return/exchange request by default.
    ReturnExchangeRequest.find.mockResolvedValue([])

    ReturnExchangeRequest.create.mockImplementation(
      async (requestData) => ({
        _id: new mongoose.Types.ObjectId(),
        ...requestData,
        status: "requested",
      })
    )

    Product.findOne.mockResolvedValue(createProduct())
  })

  // --- SUCCESS CASE ---

  test("should create a valid return request", async () => {
    const result = await createReturnExchangeRequest(
      userId,
      createRequestData()
    )

    expect(result).toBeDefined()

    expect(ReturnExchangeRequest.create).toHaveBeenCalledWith({
      user: userId,
      order: orderId,
      orderItem: orderItemId,
      type: "return",
      quantity: 1,
      reason: "size_issue",
      comment: undefined,
      proof: [],
      exchangeVariant: null,
    })
  })

  test("should create a valid exchange request with exchange variant", async () => {
    const result = await createReturnExchangeRequest(
      userId,
      createRequestData({
        type: "exchange",
        exchangeVariant: exchangeVariantId,
      })
    )

    expect(result).toBeDefined()

    expect(Product.findOne).toHaveBeenCalledWith({
      _id: productId,
      status: "active",
    })

    expect(ReturnExchangeRequest.create).toHaveBeenCalledWith({
      user: userId,
      order: orderId,
      orderItem: orderItemId,
      type: "exchange",
      quantity: 1,
      reason: "size_issue",
      comment: undefined,
      proof: [],
      exchangeVariant: exchangeVariantId,
    })
  })

  test("should preserve optional comment and required proof", async () => {
    const proof = [
      {
        url: "https://example.com/damaged-product.jpg",
        type: "image",
      },
    ]

    const result = await createReturnExchangeRequest(
      userId,
      createRequestData({
        reason: "damaged_product",
        comment: "The product has a visible defect.",
        proof,
      })
    )

    expect(result).toBeDefined()

    expect(ReturnExchangeRequest.create).toHaveBeenCalledWith({
      user: userId,
      order: orderId,
      orderItem: orderItemId,
      type: "return",
      quantity: 1,
      reason: "damaged_product",
      comment: "The product has a visible defect.",
      proof,
      exchangeVariant: null,
    })
  })

  // --- ORDER / ELIGIBILITY ---

  test.each([
    ["order does not exist", null, "Order not found", 404],
    [
      "order is not delivered",
      createOrder({ orderStatus: "shipped" }),
      "Return or exchange is available only after delivery",
      400,
    ],
    [
      "delivery timestamp is missing",
      createOrder({ statusHistory: [] }),
      "Delivery date not found",
      400,
    ],
    [
      "return window has expired",
      createOrder({
        statusHistory: [
          {
            status: "delivered",
            timestamp: new Date(
              Date.now() - 8 * 24 * 60 * 60 * 1000
            ),
          },
        ],
      }),
      "Return or exchange window has expired",
      400,
    ],
    [
      "order item does not exist",
      {
        ...createOrder(),
        items: {
          id: vi.fn(() => null),
        },
      },
      "Order item not found",
      404,
    ],
  ])(
    "should reject when %s",
    async (_scenario, order, expectedMessage, expectedStatusCode) => {
      Order.findOne.mockResolvedValue(order)

      await expect(
        createReturnExchangeRequest(userId, createRequestData())
      ).rejects.toMatchObject({
        message: expectedMessage,
        statusCode: expectedStatusCode,
      })

      // Eligibility failures must never create a request.
      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
    }
  )

  // --- INPUT VALIDATION ---

  test.each([
    ["invalid order id", { orderId: "invalid-id" }, "Invalid order id"],
    [
      "invalid order item id",
      { orderItemId: "invalid-item-id" },
      "Invalid order item id",
    ],
    [
      "invalid request type",
      { type: "refund" },
      "Invalid return or exchange type",
    ],
    [
      "zero quantity",
      { quantity: 0 },
      "Invalid quantity",
    ],
    [
      "negative quantity",
      { quantity: -1 },
      "Invalid quantity",
    ],
    [
      "decimal quantity",
      { quantity: 1.5 },
      "Invalid quantity",
    ],
    [
      "quantity greater than ordered quantity",
      { quantity: 3 },
      "Return or exchange quantity exceeds ordered quantity",
    ],
    [
      "invalid reason",
      { reason: "invalid_reason" },
      "Invalid return or exchange reason",
    ],
  ])(
    "should reject %s",
    async (_scenario, overrides, expectedMessage) => {
      await expect(
        createReturnExchangeRequest(
          userId,
          createRequestData(overrides)
        )
      ).rejects.toMatchObject({
        message: expectedMessage,
        statusCode: 400,
      })

      // Invalid input must never create a request.
      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
    }
  )

  // --- EXISTING REQUEST PROTECTION ---

  test("should reject when an active return/exchange request already exists", async () => {
    ReturnExchangeRequest.find.mockResolvedValue([
      {
      _id: new mongoose.Types.ObjectId(),
      status: "requested",
      quantity: 1,
      }
  ])

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData()
      )
    ).rejects.toMatchObject({
      message: "An active return or exchange request already exists",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  // --- PROOF VALIDATION ---

  test.each([
    "wrong_product",
    "damaged_product",
    "quality_issue",
  ])(
    "should require proof for %s reason",
    async (reason) => {
      await expect(
        createReturnExchangeRequest(
          userId,
          createRequestData({
            reason,
            proof: [],
          })
        )
      ).rejects.toMatchObject({
        message: "Proof is required for this reason",
        statusCode: 400,
      })

      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
    }
  )

  test("should reject invalid proof type", async () => {
    const proof = [
      {
        url: "https://example.com/proof.pdf",
        type: "document",
      },
    ]

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          reason: "damaged_product",
          proof,
        })
      )
    ).rejects.toMatchObject({
      message: "Invalid proof type",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject more than 4 proof images", async () => {
    const proof = Array.from({ length: 5 }, (_, index) => ({
      url: `https://example.com/image-${index + 1}.jpg`,
      type: "image",
    }))

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          reason: "damaged_product",
          proof,
        })
      )
    ).rejects.toMatchObject({
      message: "Maximum 4 proof images are allowed",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject more than 1 proof video", async () => {
    const proof = [
      {
        url: "https://example.com/video-1.mp4",
        type: "video",
      },
      {
        url: "https://example.com/video-2.mp4",
        type: "video",
      },
    ]

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          reason: "damaged_product",
          proof,
        })
      )
    ).rejects.toMatchObject({
      message: "Maximum 1 proof video is allowed",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  // --- EXCHANGE-SPECIFIC VALIDATION ---

  test("should reject exchange without exchange variant", async () => {
    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          type: "exchange",
        })
      )
    ).rejects.toMatchObject({
      message: "Exchange variant is required",
      statusCode: 400,
    })

    expect(Product.findOne).not.toHaveBeenCalled()
    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject invalid exchange variant", async () => {
    Product.findOne.mockResolvedValue(
      createProduct(null)
    )

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          type: "exchange",
          exchangeVariant: exchangeVariantId,
        })
      )
    ).rejects.toMatchObject({
      message: "Invalid exchange variant",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject exchange when original product is unavailable", async () => {
    Product.findOne.mockResolvedValue(null)

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          type: "exchange",
          exchangeVariant: exchangeVariantId,
        })
      )
    ).rejects.toMatchObject({
      message: "Product not found",
      statusCode: 404,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject exchange variant with invalid id", async () => {
    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          type: "exchange",
          exchangeVariant: "invalid-variant-id",
        })
      )
    ).rejects.toMatchObject({
      message: "Exchange variant is required",
      statusCode: 400,
    })

    // Invalid variant ID must fail before product lookup.
    expect(Product.findOne).not.toHaveBeenCalled()
    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject return request containing exchange variant", async () => {
    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          type: "return",
          exchangeVariant: exchangeVariantId,
        })
      )
    ).rejects.toMatchObject({
      message: "Exchange variant is not allowed for a return",
      statusCode: 400,
    })

    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject when completed requests consume the full ordered quantity", async () => {
    ReturnExchangeRequest.find.mockResolvedValue([
      {
        status: "completed",
        quantity: 2,
      },
    ])

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          quantity: 1,
        })
      )
    ).rejects.toMatchObject({
      message: "Return or exchange quantity exceeds remaining quantity",
      statusCode: 400,
    })

    // No quantity remains available for another return/exchange.
    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should allow a new request for the remaining quantity after partial completion", async () => {
    ReturnExchangeRequest.find.mockResolvedValue([
      {
        status: "completed",
        quantity: 1,
      },
    ])

    const result = await createReturnExchangeRequest(
      userId,
      createRequestData({
        quantity: 1,
      })
    )

    expect(result).toBeDefined()

    // Ordered quantity is 2 and 1 unit was already completed,
    // so exactly 1 unit remains eligible.
    expect(ReturnExchangeRequest.create).toHaveBeenCalledWith({
      user: userId,
      order: orderId,
      orderItem: orderItemId,
      type: "return",
      quantity: 1,
      reason: "size_issue",
      comment: undefined,
      proof: [],
      exchangeVariant: null,
    })
  })

  test("should reject proof without a valid url", async () => {
    const proof = [
      {
        type: "image",
        // URL intentionally missing.
      },
    ]

    await expect(
      createReturnExchangeRequest(
        userId,
        createRequestData({
          reason: "damaged_product",
          proof,
        })
      )
    ).rejects.toMatchObject({
      message: "Invalid proof url",
      statusCode: 400,
    })

    // Invalid proof must never create a request.
    expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })
})