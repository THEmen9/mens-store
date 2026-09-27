import { describe, it, expect, vi, beforeEach } from "vitest"
import { createReturnExchangeController } from "../controllers/returnExchange.controller.js"
import { createReturnExchangeRequest } from "../services/returnExchange.service.js"

// Mock the service so controller test only verifies controller behavior.
vi.mock("../services/returnExchange.service.js", () => ({
    createReturnExchangeRequest: vi.fn(),
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