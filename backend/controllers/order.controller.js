import {
  createOrder,
  getUserOrders,
  getOrderById
} from "../services/order.service.js"

// create-order-controller
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
// user-orders-controller
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
// order-detail-controller
async function getOrderByIdController(req, res, next) {
  try {
    const order = await getOrderById(req.user, req.params.id)

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}
export {
  createOrderController,
  getUserOrdersController,
  getOrderByIdController,
}