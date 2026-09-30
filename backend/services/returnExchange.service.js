import mongoose from "mongoose"
import Order from "../models/Order.js"
import ReturnExchangeRequest from "../models/ReturnExchangeRequest.js"
import appError from "../utils/appError.js"
import Product from "../models/Product.js"

// Creates a return or exchange request after validating
// ownership, delivery status, return window, quantity,
// existing requests, proof requirements, and exchange variant.

async function createReturnExchangeRequest(userId, requestData) {
    const {
        orderId,
        orderItemId,
        type,
        quantity,
        reason,
        comment,
        proof = [],
        exchangeVariant
    } = requestData

    // Validate IDs before querying MongoDB.
    if (!mongoose.isValidObjectId(orderId)) {
        throw new appError("Invalid order id", 400)
    }

    if (!mongoose.isValidObjectId(orderItemId)) {
        throw new appError("Invalid order item id", 400)
    }

    // Only return and exchange are valid request types.
    const validTypes = ["return", "exchange"]

    if (!validTypes.includes(type)) {
    throw new appError("Invalid return or exchange type", 400)
    }

    // Find the order only if it belongs to the authenticated user.
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    })

    if (!order) {
        throw new appError("Order not found", 404)
    }

    // Return/exchange is available only after successful delivery.
    if (order.orderStatus !== "delivered") {
        throw new appError(
        "Return or exchange is available only after delivery",
        400
        )
    }
    // Delivery timestamp
    // The return/exchange window starts from the actual delivery event.
    const deliveredHistory = order.statusHistory.find(
        (entry) => entry.status === "delivered"
    )

    if (!deliveredHistory) {
        throw new appError("Delivery date not found", 400)
    }

    // Order item validation
    const orderItem = order.items.id(orderItemId)

    if (!orderItem) {
        throw new appError("Order item not found", 404)
    }

    //  Return/Exchange policy validation
    const policy = orderItem.returnPolicy

    if (!policy) {
        throw new appError(
            "Return/exchange policy snapshot not found",
            500
        )
    }

    if (type === "return" && !policy.returnAllowed) {
        throw new appError(
            "Returns are not allowed for this item",
            400
        )
    }

    if (type === "exchange" && !policy.exchangeAllowed) {
        throw new appError(
            "Exchanges are not allowed for this item",
            400
        )
    }
    // Return/Exchange window
    const returnWindowMs =
        policy.windowDays * 24 * 60 * 60 * 1000

    const returnWindowExpired =
        Date.now() >
        deliveredHistory.timestamp.getTime() + returnWindowMs

    if (returnWindowExpired) {
        throw new appError(
            "Return or exchange window has expired",
            400
        )
    }

    // Requested quantity must be a positive whole number.
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new appError("Invalid quantity", 400)
    }

    // User cannot return/exchange more than the quantity originally ordered.
    if (quantity > orderItem.quantity) {
        throw new appError(
        "Return or exchange quantity exceeds ordered quantity",
        400
        )
    }

    // Find previous return/exchange requests for this exact order item.
    const previousRequests = await ReturnExchangeRequest.find({
        order: order._id,
        orderItem: orderItem._id,
        status: {
            $in: [
                "requested",
                "approved",
                "pickup_pending",
                "picked_up",
                "received",
                "completed",
            ],
        },
    })

    // An active request already owns the return/exchange process for this item.
    const hasActiveRequest = previousRequests.some(
        (request) => request.status !== "completed"
    )

    if (hasActiveRequest) {
        throw new appError(
            "An active return or exchange request already exists",
            400
        )
    }

    // Completed requests have already consumed returned/exchanged quantity.
    // Prevent the customer from exceeding the quantity originally ordered.
    const completedQuantity = previousRequests
        .filter((request) => request.status === "completed")
        .reduce((total, request) => total + request.quantity, 0)

    if (completedQuantity + quantity > orderItem.quantity) {
        throw new appError(
            "Return or exchange quantity exceeds remaining quantity",
            400
        )
    }
    // Only predefined business reasons are accepted.
    const validReasons = [
        "size_issue",
        "wrong_product",
        "damaged_product",
        "quality_issue",
        "changed_mind",
        "other",
    ]

    if (!validReasons.includes(reason)) {
        throw new appError("Invalid return or exchange reason", 400)
    }

    // ==================== Proof Validation ====================

    // Only image and video proof types are allowed.
    const validProofTypes = ["image", "video"]

    if (!Array.isArray(proof)) {
        throw new appError("Invalid proof", 400)
    }

    // Every proof item must contain valid Cloudinary metadata.
    for (const item of proof) {
        if (
            !item ||
            typeof item.url !== "string" ||
            item.url.trim().length === 0
        ) {
            throw new appError("Invalid proof url", 400)
        }

        if (
            typeof item.publicId !== "string" ||
            item.publicId.trim().length === 0
        ) {
            throw new appError("Invalid proof public id", 400)
        }

        if (!validProofTypes.includes(item.type)) {
            throw new appError("Invalid proof type", 400)
        }

        if (!validProofTypes.includes(item.resourceType)) {
            throw new appError("Invalid proof resource type", 400)
        }
    }

    // A request can contain at most 4 proof images.
    const imageProofCount = proof.filter(
        (item) => item.type === "image"
    ).length

    if (imageProofCount > 4) {
        throw new appError( "Maximum 4 proof images are allowed", 400 )
    }

    // A request can contain at most 1 proof video.
    const videoProofCount = proof.filter(
        (item) => item.type === "video"
    ).length

    if (videoProofCount > 1) {
        throw new appError( "Maximum 1 proof video is allowed", 400 )
    }
    // These reasons require genuine product evidence for admin review.
    const proofRequiredReasons = [
        "wrong_product",
        "damaged_product",
        "quality_issue",
    ]

    if (proofRequiredReasons.includes(reason) && proof.length === 0) {
        throw new appError("Proof is required for this reason", 400)
    }

    // Exchange requires a valid variant belonging to the same product.
    if (type === "exchange") {
        if (!mongoose.isValidObjectId(exchangeVariant)) {
        throw new appError("Exchange variant is required", 400)
        }

        const product = await Product.findOne({
        _id: orderItem.product,
        status: "active",
        })

        if (!product) {
        throw new appError("Product not found", 404)
        }

        const variant = product.variants.id(exchangeVariant)

        if (!variant) {
            throw new appError("Invalid exchange variant", 400)
        }
        // Exchange target must have stock available at request time.
        if (variant.stock <= 0) {
            throw new appError("Exchange variant is out of stock", 400)
        }
    }

    // A return request must not contain an exchange variant.
    if (type === "return" && exchangeVariant) {
        throw new appError(
        "Exchange variant is not allowed for a return",
        400
        )
    }

    // Create the request only after all business validations pass.
    const request = await ReturnExchangeRequest.create({
        user: userId,
        order: order._id,
        orderItem: orderItem._id,
        type,
        quantity,
        reason,
        comment,
        proof,
        exchangeVariant: type === "exchange" ? exchangeVariant : null,
    })

    return request
}

// Adds exchange variant details to exchange requests without creating
// one database query per request.
async function attachExchangeVariantDetails(requests, userId) {
    const exchangeRequests = requests.filter(
        (request) =>
            request.type === "exchange" &&
            request.exchangeVariant
    )

    // Return requests do not need product/variant lookup.
    if (exchangeRequests.length === 0) {
        return requests
    }

    // Get unique order IDs used by exchange requests.
    const orderIds = [
        ...new Set(
            exchangeRequests.map((request) => request.order.toString())
        ),
    ]

    // Fetch all required orders in one database query.
    const orders = await Order.find({
        _id: { $in: orderIds },
        user: userId,
    }).select("items")

    // Map orders by ID so lookup is O(1) in memory.
    const orderMap = new Map(
        orders.map((order) => [order._id.toString(), order])
    )

    // Find the Product IDs required by the exchange requests.
    const productIds = []

    for (const request of exchangeRequests) {
        const order = orderMap.get(request.order.toString())

        if (!order) {
            continue
        }

        const orderItem = order.items.id(request.orderItem)

        if (orderItem?.product) {
            productIds.push(orderItem.product.toString())
        }
    }

    const uniqueProductIds = [...new Set(productIds)]

    // Fetch all required products in one database query.
    const products = await Product.find({
        _id: { $in: uniqueProductIds },
    }).select("variants")

    // Map products by ID for fast in-memory lookup.
    const productMap = new Map(
        products.map((product) => [product._id.toString(), product])
    )

    return requests.map((request) => {
        // Return requests keep their original response shape.
        if (
            request.type !== "exchange" ||
            !request.exchangeVariant
        ) {
            return request.toObject()
        }

        const order = orderMap.get(request.order.toString())

        if (!order) {
            return request.toObject()
        }

        const orderItem = order.items.id(request.orderItem)

        if (!orderItem?.product) {
            return request.toObject()
        }

        const product = productMap.get(orderItem.product.toString())

        if (!product) {
            return request.toObject()
        }

        const variant = product.variants.id(request.exchangeVariant)

        return {
            ...request.toObject(),

            // Keep only the variant data required by the customer UI.
            exchangeVariant: variant
                ? {
                      _id: variant._id,
                      sku: variant.sku,
                      color: variant.color,
                      size: variant.size,
                  }
                : null,
        }
    })
}

// Fetches all return/exchange requests for an order
async function getReturnExchangeRequestsByOrder(userId, orderId) {
    // Validate the order ID before querying MongoDB.
    if (!mongoose.isValidObjectId(orderId)) {
        throw new appError("Invalid order id", 400)
    }

    // Verify that the requested order belongs to the authenticated user.
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    })

    if (!order) {
        throw new appError("Order not found", 404)
    }

    // Fetch only requests belonging to this authenticated user's order.
    const requests = await ReturnExchangeRequest.find({
        order: order._id,
        user: userId,
    }).sort({ createdAt: -1 })

    return attachExchangeVariantDetails(requests, userId)
}
// Calculates Return/Exchange eligibility for every item in an order.
async function getReturnExchangeEligibility(userId, orderId) {
    // Validate the order ID before querying MongoDB.
    if (!mongoose.isValidObjectId(orderId)) {
        throw new appError("Invalid order id", 400)
    }

    // Only the authenticated user's order can be checked.
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    })

    if (!order) {
        throw new appError("Order not found", 404)
    }

    // Find the actual delivery timestamp from the order history.
    const deliveredHistory = order.statusHistory.find(
        (entry) => entry.status === "delivered"
    )

    const deliveredAt = deliveredHistory?.timestamp || null

    // Fetch previous requests once instead of querying separately for
    // every order item.
    const previousRequests = await ReturnExchangeRequest.find({
        order: order._id,
        user: userId,
        status: {
            $in: [
                "requested",
                "approved",
                "pickup_pending",
                "picked_up",
                "received",
                "completed",
            ],
        },
    })

    return order.items.map((orderItem) => {
        // Policy comes from the order-time snapshot, not the current Product.
        const policy = orderItem.returnPolicy

        // If the old order does not contain a policy snapshot, the data
        // is incomplete and eligibility cannot be calculated safely.
        if (!policy) {
            throw new appError(
                "Return/exchange policy snapshot not found",
                500
            )
        }

        // Find requests belonging to this exact order item.
        const itemRequests = previousRequests.filter(
            (request) =>
                request.orderItem.toString() === orderItem._id.toString()
        )

        // Any non-completed request currently owns the return/exchange flow.
        const hasActiveRequest = itemRequests.some(
            (request) => request.status !== "completed"
        )

        // Completed requests have already consumed part of the original
        // quantity, so only the remaining quantity can be processed.
        const completedQuantity = itemRequests
            .filter((request) => request.status === "completed")
            .reduce((total, request) => total + request.quantity, 0)

        const remainingQuantity = Math.max(
            orderItem.quantity - completedQuantity,
            0
        )

        // Without successful delivery, the return/exchange window has not started.
        if (order.orderStatus !== "delivered" || !deliveredAt) {
            return {
                orderItemId: orderItem._id,
                return: {
                    allowed: policy.returnAllowed,
                    eligible: false,
                    remainingQuantity,
                    windowStart: null,
                    windowEnd: null,
                    reason: "not_delivered",
                },
                exchange: {
                    allowed: policy.exchangeAllowed,
                    eligible: false,
                    remainingQuantity,
                    windowStart: null,
                    windowEnd: null,
                    reason: "not_delivered",
                },
            }
        }

        const windowStart = new Date(deliveredAt)

        const windowEnd = new Date(
            windowStart.getTime() +
                policy.windowDays * 24 * 60 * 60 * 1000
        )

        const windowExpired = Date.now() > windowEnd.getTime()

        // Shared eligibility reason for conditions that affect both
        // Return and Exchange.
        let commonReason = null

        if (windowExpired) {
            commonReason = "window_expired"
        } else if (hasActiveRequest) {
            commonReason = "active_request"
        } else if (remainingQuantity === 0) {
            commonReason = "quantity_exhausted"
        }

        return {
            orderItemId: orderItem._id,

            return: {
                allowed: policy.returnAllowed,
                eligible:
                    policy.returnAllowed && commonReason === null,
                remainingQuantity,
                windowStart,
                windowEnd,
                reason: policy.returnAllowed
                    ? commonReason
                    : "product_policy",
            },

            exchange: {
                allowed: policy.exchangeAllowed,
                eligible:
                    policy.exchangeAllowed && commonReason === null,
                remainingQuantity,
                windowStart,
                windowEnd,
                reason: policy.exchangeAllowed
                    ? commonReason
                    : "product_policy",
            },
        }
    })
}

// Fetches all return/exchange requests belonging to the authenticated user.
async function getUserReturnExchangeRequests(userId) {
    // Fetch only requests owned by the authenticated user.
    const requests = await ReturnExchangeRequest.find({
        user: userId,
    }).sort({ createdAt: -1 })

    return attachExchangeVariantDetails(requests, userId)
}

export { 
    createReturnExchangeRequest,
    getReturnExchangeEligibility,
    getReturnExchangeRequestsByOrder,
    getUserReturnExchangeRequests
}