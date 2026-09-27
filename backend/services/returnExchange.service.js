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
        exchangeVariant,
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

    // Get the timestamp when the order was marked as delivered.
    const deliveredHistory = order.statusHistory.find(
        (entry) => entry.status === "delivered"
    )

    if (!deliveredHistory) {
        throw new appError("Delivery date not found", 400)
    }

    // Return/exchange window is valid for 7 days from delivery.
    const returnWindowMs = 7 * 24 * 60 * 60 * 1000

    const returnWindowExpired =
        Date.now() >
        deliveredHistory.timestamp.getTime() + returnWindowMs

    if (returnWindowExpired) {
        throw new appError("Return or exchange window has expired", 400)
    }

    // Find the exact item inside the order.
    const orderItem = order.items.id(orderItemId)

    if (!orderItem) {
        throw new appError("Order item not found", 404)
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

    // Only image and video proof types are allowed.
    const validProofTypes = ["image", "video"]

    if (!Array.isArray(proof)) {
        throw new appError("Invalid proof", 400)
    }

    const hasInvalidProofUrl = proof.some(
        (item) =>
            !item ||
            typeof item.url !== "string" ||
            item.url.trim().length === 0
    )

    if (hasInvalidProofUrl) {
        throw new appError("Invalid proof url", 400)
    }

    const hasInvalidProofType = proof.some(
        (item) => !validProofTypes.includes(item.type)
    )

    if (hasInvalidProofType) {
        throw new appError("Invalid proof type", 400)
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

export { createReturnExchangeRequest }