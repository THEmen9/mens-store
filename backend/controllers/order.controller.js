import { createOrder } from "../services/order.service.js"

async function createOrderController(req, res, next) {
  try {
    const order = await createOrder(req.user, req.body)

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export {
  createOrderController,
}