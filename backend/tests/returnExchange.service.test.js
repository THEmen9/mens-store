import { describe, test, expect, vi, beforeEach } from "vitest"
import mongoose from "mongoose"

import { 
  createReturnExchangeRequest,
  getReturnExchangeEligibility,
  getReturnExchangeRequestsByOrder,
  getUserReturnExchangeRequests
} from "../services/returnExchange.service.js"

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
    find: vi.fn(),
  },
}))

vi.mock("../models/Product.js", () => ({
  default: {
    findOne: vi.fn(),
    find: vi.fn(),
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

  // Simulates the metadata returned by the Cloudinary upload step.
  const createProof = (overrides = {}) => ({
      url: "https://example.com/proof.jpg",
      type: "image",
      publicId: "return-exchange/proof-123",
      resourceType: "image",
      ...overrides,
  })

  const createOrderItem = (overrides = {}) => ({
    _id: orderItemId,
    product: productId,
    quantity: 2,
    // Eligibility uses the policy captured when the order was created.
    returnPolicy: {
      returnAllowed: true,
      exchangeAllowed: true,
      windowDays: 7,
    },
    ...overrides,
  })

  const createOrder = (
      overrides = {},
      orderItemOverrides = {} ) => ({
        _id: orderId,
        user: userId,
        orderStatus: "delivered",

      // Delivery timestamp is required for the return/exchange window.
      statusHistory: [
          {
              status: "delivered",
              timestamp: new Date(),
          },
      ],

      // Simulate Mongoose's document-array id() helper.
      // Allow individual tests to override the item's policy snapshot.
      items: {
          id: vi.fn(() => createOrderItem(orderItemOverrides)),
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
      createProof({
          url: "https://example.com/damaged-product.jpg",
      }),
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
        createProof({
          type: "document",
      }),
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
    const proof = Array.from({ length: 5 }, (_, index) =>
      createProof({
          url: `https://example.com/image-${index + 1}.jpg`,
      })
  )

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
      createProof({
          url: "https://example.com/video-1.mp4",
          type: "video",
          publicId: "return-exchange/video-1",
          resourceType: "video",
      }),
      createProof({
          url: "https://example.com/video-2.mp4",
          type: "video",
          publicId: "return-exchange/video-2",
          resourceType: "video",
      }),
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
  })//

  test("should reject exchange variant when stock is unavailable", async () => {
    // Simulate a valid exchange variant that currently has no stock.
    Product.findOne.mockResolvedValue(
        createProduct({
            _id: exchangeVariantId,
            stock: 0,
        })
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
        message: "Exchange variant is out of stock",
        statusCode: 400,
    })

    // An unavailable variant must never create an exchange request.
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
        createProof({
            url: "",
        }),
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

  // --- RETURN / EXCHANGE POLICY VALIDATION ---
  test("should reject return when return policy does not allow returns", async () => {
      Order.findOne.mockResolvedValue(
          createOrder(
              {},
              {
                  returnPolicy: {
                      returnAllowed: false,
                      exchangeAllowed: true,
                      windowDays: 7,
                  },
              }
          )
      )

      await expect(
          createReturnExchangeRequest(
              userId,
              createRequestData({
                  type: "return",
              })
          )
      ).rejects.toMatchObject({
          message: "Returns are not allowed for this item",
          statusCode: 400,
      })

      // Policy rejection must happen before request creation.
      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject exchange when exchange policy does not allow exchanges", async () => {
      Order.findOne.mockResolvedValue(
          createOrder(
              {},
              {
                  returnPolicy: {
                      returnAllowed: true,
                      exchangeAllowed: false,
                      windowDays: 7,
                  },
              }
          )
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
          message: "Exchanges are not allowed for this item",
          statusCode: 400,
      })

      // Policy rejection must happen before request creation.
      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should reject when return/exchange policy snapshot is missing", async () => {
      Order.findOne.mockResolvedValue(
          createOrder(
              {},
              {
                  returnPolicy: undefined,
              }
          )
      )

      await expect(
          createReturnExchangeRequest(
              userId,
              createRequestData()
          )
      ).rejects.toMatchObject({
          message: "Return/exchange policy snapshot not found",
          statusCode: 500,
      })

      // Missing policy must never allow request creation.
      expect(ReturnExchangeRequest.create).not.toHaveBeenCalled()
  })

  test("should use the return policy window instead of a hardcoded 7-day window", async () => {
    const deliveredAt = new Date(
        Date.now() - 8 * 24 * 60 * 60 * 1000
    )

    Order.findOne.mockResolvedValue(
        createOrder(
            {
                statusHistory: [
                    {
                        status: "delivered",
                        timestamp: deliveredAt,
                    },
                ],
            },
            {
                returnPolicy: {
                    returnAllowed: true,
                    exchangeAllowed: true,

                    // 30-day policy should still allow a request
                    // even though delivery was 8 days ago.
                    windowDays: 30,
                },
            }
        )
    )

    const result = await createReturnExchangeRequest(
        userId,
        createRequestData()
    )

    expect(result).toBeDefined()

    expect(ReturnExchangeRequest.create).toHaveBeenCalled()
  })
})

describe("getReturnExchangeRequestsByOrder", () => {
  const userId = new mongoose.Types.ObjectId()
  const orderId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return all return/exchange requests for the user's order", async () => {
    const requests = [
      {
        _id: new mongoose.Types.ObjectId(),
        order: orderId,
        user: userId,
        type: "return",
        status: "requested",
      },
    ]

    Order.findOne.mockResolvedValue({
      _id: orderId,
      user: userId,
    })

    // Simulate Mongoose query chaining: find().sort().
    ReturnExchangeRequest.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(requests),
    })

    const result = await getReturnExchangeRequestsByOrder(
      userId,
      orderId
    )

    expect(Order.findOne).toHaveBeenCalledWith({
      _id: orderId,
      user: userId,
    })

    expect(ReturnExchangeRequest.find).toHaveBeenCalledWith({
      order: orderId,
      user: userId,
    })

    expect(result).toEqual(requests)
  })

  test("should reject when the order does not belong to the user", async () => {
    Order.findOne.mockResolvedValue(null)

    await expect(
      getReturnExchangeRequestsByOrder(userId, orderId)
    ).rejects.toMatchObject({
      message: "Order not found",
      statusCode: 404,
    })

    // Do not query return/exchange requests for an unauthorized order.
    expect(ReturnExchangeRequest.find).not.toHaveBeenCalled()
  })

  test("should return exchange variant details for an exchange request", async () => {
    const exchangeVariantId = new mongoose.Types.ObjectId()
    const productId = new mongoose.Types.ObjectId()
    const orderItemId = new mongoose.Types.ObjectId()

    const requests = [
      {
        _id: new mongoose.Types.ObjectId(),
        order: orderId,
        user: userId,
        orderItem: orderItemId,
        type: "exchange",
        exchangeVariant: exchangeVariantId,
        status: "requested",

        // Simulate a Mongoose document returned by find().
        toObject: vi.fn(() => ({
          _id: requests[0]?._id,
          order: orderId,
          user: userId,
          orderItem: orderItemId,
          type: "exchange",
          exchangeVariant: exchangeVariantId,
          status: "requested",
        })),
      },
    ]

    Order.findOne.mockResolvedValue({
      _id: orderId,
      user: userId,
    })

    ReturnExchangeRequest.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(requests),
    })

    Order.find.mockReturnValue({
      select: vi.fn().mockResolvedValue([
        {
          _id: orderId,
          items: {
            id: vi.fn(() => ({
              _id: orderItemId,
              product: productId,
            })),
          },
        },
      ]),
    })

    Product.find.mockReturnValue({
      select: vi.fn().mockResolvedValue([
        {
          _id: productId,
          variants: {
            id: vi.fn(() => ({
              _id: exchangeVariantId,
              sku: "JEANS-BLUE-32",
              color: "Blue",
              size: "32",
            })),
          },
        },
      ]),
    })

    const result = await getReturnExchangeRequestsByOrder(
      userId,
      orderId
    )

    expect(result[0].exchangeVariant).toEqual({
      _id: exchangeVariantId,
      sku: "JEANS-BLUE-32",
      color: "Blue",
      size: "32",
    })
  })

})

describe("getUserReturnExchangeRequests", () => {
  const userId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return all return/exchange requests for the authenticated user", async () => {
    const requests = [
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        type: "return",
        status: "requested",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        type: "exchange",
        status: "completed",
      },
    ]

    // Simulate Mongoose find().sort() query chaining.
    ReturnExchangeRequest.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(requests),
    })

    const result = await getUserReturnExchangeRequests(userId)

    expect(ReturnExchangeRequest.find).toHaveBeenCalledWith({
      user: userId,
    })

    expect(result).toEqual(requests)
  })

  test("should return exchange variant details for the user's exchange request", async () => {
    const orderId = new mongoose.Types.ObjectId()
    const orderItemId = new mongoose.Types.ObjectId()
    const productId = new mongoose.Types.ObjectId()
    const exchangeVariantId = new mongoose.Types.ObjectId()

    const requests = [
      {
        _id: new mongoose.Types.ObjectId(),
        order: orderId,
        user: userId,
        orderItem: orderItemId,
        type: "exchange",
        exchangeVariant: exchangeVariantId,
        status: "requested",

        // Simulate a Mongoose document returned by find().
        toObject: vi.fn(() => ({
          _id: requests[0]?._id,
          order: orderId,
          user: userId,
          orderItem: orderItemId,
          type: "exchange",
          exchangeVariant: exchangeVariantId,
          status: "requested",
        })),
      },
    ]

    ReturnExchangeRequest.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(requests),
    })

    Order.find.mockReturnValue({
      select: vi.fn().mockResolvedValue([
        {
          _id: orderId,
          items: {
            id: vi.fn(() => ({
              _id: orderItemId,
              product: productId,
            })),
          },
        },
      ])
    })

    Product.find.mockReturnValue({
      select: vi.fn().mockResolvedValue([
        {
          _id: productId,
          variants: {
            id: vi.fn(() => ({
              _id: exchangeVariantId,
              sku: "JEANS-BLUE-32",
              color: "Blue",
              size: "32",
            })),
          },
        },
      ])
    })

    const result = await getUserReturnExchangeRequests(userId)

    expect(result[0].exchangeVariant).toEqual({
      _id: exchangeVariantId,
      sku: "JEANS-BLUE-32",
      color: "Blue",
      size: "32",
    })
  })

})

describe("getReturnExchangeEligibility", () => {
  const userId = new mongoose.Types.ObjectId()
  const orderId = new mongoose.Types.ObjectId()
  const orderItemId = new mongoose.Types.ObjectId()
  const productId = new mongoose.Types.ObjectId()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should mark return and exchange as eligible for a delivered order", async () => {
    const order = {
      _id: orderId,
      user: userId,
      orderStatus: "delivered",

      statusHistory: [
        {
          status: "delivered",
          timestamp: new Date(),
        },
      ],

      items: [
        {
          _id: orderItemId,
          product: productId,
          quantity: 2,

          // Eligibility uses the policy captured at order creation.
          returnPolicy: {
            returnAllowed: true,
            exchangeAllowed: true,
            windowDays: 7,
          },
        },
      ],
    }

    Order.findOne.mockResolvedValue(order)

    // No previous return/exchange request exists for this order.
    ReturnExchangeRequest.find.mockResolvedValue([])

    const result = await getReturnExchangeEligibility(
      userId,
      orderId
    )

    expect(result).toHaveLength(1)

    expect(result[0].orderItemId).toBe(orderItemId)

    expect(result[0].return.allowed).toBe(true)
    expect(result[0].return.eligible).toBe(true)
    expect(result[0].return.remainingQuantity).toBe(2)
    expect(result[0].return.reason).toBeNull()

    expect(result[0].exchange.allowed).toBe(true)
    expect(result[0].exchange.eligible).toBe(true)
    expect(result[0].exchange.remainingQuantity).toBe(2)
    expect(result[0].exchange.reason).toBeNull()
  })

  test("should mark return and exchange as not eligible when order is not delivered", async () => {
    const order = {
      _id: orderId,
      user: userId,
      orderStatus: "processing",

      statusHistory: [
        {
          status: "processing",
          timestamp: new Date(),
        },
      ],

      items: [
        {
          _id: orderItemId,
          product: productId,
          quantity: 2,

          // Eligibility uses the policy captured at order creation.
          returnPolicy: {
            returnAllowed: true,
            exchangeAllowed: true,
            windowDays: 7,
          },
        },
      ],
    }

    Order.findOne.mockResolvedValue(order)

    // No previous return/exchange request exists for this order.
    ReturnExchangeRequest.find.mockResolvedValue([])

    const result = await getReturnExchangeEligibility(
      userId,
      orderId
    )

    expect(result).toHaveLength(1)

    expect(result[0].orderItemId).toBe(orderItemId)

    expect(result[0].return.allowed).toBe(true)
    expect(result[0].return.eligible).toBe(false)
    expect(result[0].return.remainingQuantity).toBe(2)
    expect(result[0].return.reason).toBe("not_delivered")

    expect(result[0].exchange.allowed).toBe(true)
    expect(result[0].exchange.eligible).toBe(false)
    expect(result[0].exchange.remainingQuantity).toBe(2)
    expect(result[0].exchange.reason).toBe("not_delivered")

    expect(result[0].return.windowStart).toBeNull()
    expect(result[0].return.windowEnd).toBeNull()

    expect(result[0].exchange.windowStart).toBeNull()
    expect(result[0].exchange.windowEnd).toBeNull()
  })

  test("should make return unavailable when return is disabled by product policy", async () => {
    const order = {
      _id: orderId,
      user: userId,
      orderStatus: "delivered",

      statusHistory: [
        {
          status: "delivered",
          timestamp: new Date(),
        },
      ],

      items: [
        {
          _id: orderItemId,
          product: productId,
          quantity: 2,

          // Return is disabled, but exchange is still allowed.
          returnPolicy: {
            returnAllowed: false,
            exchangeAllowed: true,
            windowDays: 7,
          },
        },
      ],
    }

    Order.findOne.mockResolvedValue(order)

    // No previous return/exchange request exists.
    ReturnExchangeRequest.find.mockResolvedValue([])

    const result = await getReturnExchangeEligibility(
      userId,
      orderId
    )

    expect(result).toHaveLength(1)

    expect(result[0].orderItemId).toBe(orderItemId)

    // Return is blocked by the order-time product policy.
    expect(result[0].return.allowed).toBe(false)
    expect(result[0].return.eligible).toBe(false)
    expect(result[0].return.remainingQuantity).toBe(2)
    expect(result[0].return.reason).toBe("product_policy")

    // Exchange remains available.
    expect(result[0].exchange.allowed).toBe(true)
    expect(result[0].exchange.eligible).toBe(true)
    expect(result[0].exchange.remainingQuantity).toBe(2)
    expect(result[0].exchange.reason).toBeNull()
  })

  test("should make exchange unavailable when exchange is disabled by product policy", async () => {
    const order = {
      _id: orderId,
      user: userId,
      orderStatus: "delivered",

      statusHistory: [
        {
          status: "delivered",
          timestamp: new Date(),
        },
      ],

      items: [
        {
          _id: orderItemId,
          product: productId,
          quantity: 2,

          // Exchange is disabled, but return is still allowed.
          returnPolicy: {
            returnAllowed: true,
            exchangeAllowed: false,
            windowDays: 7,
          },
        },
      ],
    }

    Order.findOne.mockResolvedValue(order)

    // No previous return/exchange request exists.
    ReturnExchangeRequest.find.mockResolvedValue([])

    const result = await getReturnExchangeEligibility(
      userId,
      orderId
    )

    expect(result).toHaveLength(1)

    expect(result[0].orderItemId).toBe(orderItemId)

    // Return remains available.
    expect(result[0].return.allowed).toBe(true)
    expect(result[0].return.eligible).toBe(true)
    expect(result[0].return.remainingQuantity).toBe(2)
    expect(result[0].return.reason).toBeNull()

    // Exchange is blocked by the order-time product policy.
    expect(result[0].exchange.allowed).toBe(false)
    expect(result[0].exchange.eligible).toBe(false)
    expect(result[0].exchange.remainingQuantity).toBe(2)
    expect(result[0].exchange.reason).toBe("product_policy")
  })

  test("should mark return and exchange as not eligible when the return window has expired", async () => {
    // Create a delivery date far enough in the past for the 7-day window to expire.
    const deliveredAt = new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000
    )

    const order = {
      _id: orderId,
      user: userId,
      orderStatus: "delivered",

      statusHistory: [
        {
          status: "delivered",
          timestamp: deliveredAt,
        },
      ],

      items: [
        {
          _id: orderItemId,
          product: productId,
          quantity: 2,

          // The order-time policy allows both Return and Exchange.
          returnPolicy: {
            returnAllowed: true,
            exchangeAllowed: true,
            windowDays: 7,
          },
        },
      ],
    }

    Order.findOne.mockResolvedValue(order)

    // No previous return/exchange request exists.
    ReturnExchangeRequest.find.mockResolvedValue([])

    const result = await getReturnExchangeEligibility(
      userId,
      orderId
    )

    expect(result).toHaveLength(1)

    expect(result[0].orderItemId).toBe(orderItemId)

    // Return window has expired.
    expect(result[0].return.allowed).toBe(true)
    expect(result[0].return.eligible).toBe(false)
    expect(result[0].return.remainingQuantity).toBe(2)
    expect(result[0].return.reason).toBe("window_expired")

    // Exchange window has expired as well.
    expect(result[0].exchange.allowed).toBe(true)
    expect(result[0].exchange.eligible).toBe(false)
    expect(result[0].exchange.remainingQuantity).toBe(2)
    expect(result[0].exchange.reason).toBe("window_expired")
  })

})