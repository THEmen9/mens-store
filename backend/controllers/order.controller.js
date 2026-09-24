import { createOrder, getUserOrders } from "../services/order.service.js"



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

async function getUserOrdersController(req, res, next) {
  try {
    const orders = await getUserOrders(req.user)

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalOrders: orders.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

export {
  createOrderController,
  getUserOrdersController,
}