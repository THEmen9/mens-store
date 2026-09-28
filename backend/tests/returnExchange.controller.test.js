import { describe, it, expect, vi, beforeEach } from "vitest"
import { 
    createReturnExchangeController,
    getReturnExchangeRequestsByOrderController,
    getUserReturnExchangeRequestsController
} from "../controllers/returnExchange.controller.js"

import { 
    createReturnExchangeRequest,
    getReturnExchangeRequestsByOrder,
    getUserReturnExchangeRequests
} from "../services/returnExchange.service.js"

// Mock the service so controller test only verifies controller behavior.
vi.mock("../services/returnExchange.service.js", () => ({
    createReturnExchangeRequest: vi.fn(),
    getReturnExchangeRequestsByOrder: vi.fn(),
    getUserReturnExchangeRequests: vi.fn(),
}))

describe("createReturnExchangeController", () => {
    let req
    let res
    let next

    beforeEach(() => {
        // Reset request/response mocks before every test.
        req = {
            user: "user-id",
            body: {
                orderId: "order-id",
                orderItemId: "order-item-id",
                type: "return",
                quantity: 1,
                reason: "size_issue",
            },
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }

        next = vi.fn()

        vi.clearAllMocks()
    })

    it("should return 201 when request is created successfully", async () => {
        const createdRequest = {
            _id: "request-id",
            type: "return",
            quantity: 1,
            status: "requested",
        }

        createReturnExchangeRequest.mockResolvedValue(createdRequest)

        await createReturnExchangeController(req, res, next)

        expect(createReturnExchangeRequest).toHaveBeenCalledWith(
            req.user,
            req.body
        )

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Return or exchange request created successfully",
            data: createdRequest,
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should pass service errors to next", async () => {
        const error = new Error("Return window expired")

        createReturnExchangeRequest.mockRejectedValue(error)

        await createReturnExchangeController(req, res, next)

        // Controller should not handle business errors itself.
        expect(next).toHaveBeenCalledWith(error)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })
})

describe("getReturnExchangeRequestsByOrderController", () => {
    let req
    let res
    let next

    beforeEach(() => {
        // Reset request/response mocks before every test.
        req = {
            user: "user-id",
            params: {
                orderId: "order-id",
            },
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }

        next = vi.fn()

        vi.clearAllMocks()
    })

    it("should return 200 with order return/exchange requests", async () => {
        const requests = [
            {
                _id: "request-id",
                type: "return",
                quantity: 1,
                status: "requested",
            },
        ]

        getReturnExchangeRequestsByOrder.mockResolvedValue(requests)

        await getReturnExchangeRequestsByOrderController(req, res, next)

        expect(getReturnExchangeRequestsByOrder).toHaveBeenCalledWith(
            req.user,
            req.params.orderId
        )

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                requests,
            },
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should pass service errors to next", async () => {
        const error = new Error("Order not found")

        getReturnExchangeRequestsByOrder.mockRejectedValue(error)

        await getReturnExchangeRequestsByOrderController(req, res, next)

        // Controller should delegate business errors to the centralized error handler.
        expect(next).toHaveBeenCalledWith(error)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })
})

describe("getUserReturnExchangeRequestsController", () => {
    let req
    let res
    let next

    beforeEach(() => {
        // Reset request/response mocks before every test.
        req = {
            user: "user-id",
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }

        next = vi.fn()

        vi.clearAllMocks()
    })

    it("should return 200 with the user's return/exchange requests", async () => {
        const requests = [
            {
                _id: "request-1",
                type: "return",
                status: "requested",
            },
            {
                _id: "request-2",
                type: "exchange",
                status: "completed",
            },
        ]

        getUserReturnExchangeRequests.mockResolvedValue(requests)

        await getUserReturnExchangeRequestsController(req, res, next)

        expect(getUserReturnExchangeRequests).toHaveBeenCalledWith(
            req.user
        )

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                requests,
            },
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should pass service errors to next", async () => {
        const error = new Error("Failed to fetch requests")

        getUserReturnExchangeRequests.mockRejectedValue(error)

        await getUserReturnExchangeRequestsController(req, res, next)

        // Controller should delegate service errors to the centralized error handler.
        expect(next).toHaveBeenCalledWith(error)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })
})