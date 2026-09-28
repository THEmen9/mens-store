import { 
    createReturnExchangeRequest,
    getReturnExchangeRequestsByOrder,
    getUserReturnExchangeRequests
} from "../services/returnExchange.service.js"

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

// Fetches all return/exchange requests for a specific order.
async function getReturnExchangeRequestsByOrderController(req, res, next) {
    try {
        const requests = await getReturnExchangeRequestsByOrder(
            req.user,
            req.params.orderId
        )

        res.status(200).json({
            success: true,
            data: {
                requests,
            },
        })
    } catch (error) {
        // Pass service errors to the centralized error handler.
        next(error)
    }
}
// Fetches all return/exchange requests belonging to the authenticated user.
async function getUserReturnExchangeRequestsController(req, res, next) {
    try {
        const requests = await getUserReturnExchangeRequests(req.user)

        res.status(200).json({
            success: true,
            data: {
                requests,
            },
        })
    } catch (error) {
        // Pass service errors to the centralized error handler.
        next(error)
    }
}

export { 
    createReturnExchangeController,
    getReturnExchangeRequestsByOrderController,
    getUserReturnExchangeRequestsController
 };