import { createReturnExchangeRequest } from "../services/returnExchange.service.js"

// Creates a customer return/exchange request.
async function createReturnExchangeController(req, res, next) {
    try {
        const request = await createReturnExchangeRequest(
            req.user,
            req.body
        )

        res.status(201).json({
            success: true,
            message: "Return or exchange request created successfully",
            data: request,
        })
    } catch (error) {
        // Pass service errors to the centralized error handler.
        next(error)
    }
}

export { createReturnExchangeController }