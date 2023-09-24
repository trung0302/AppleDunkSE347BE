import express from 'express'
const router = express.Router()
import * as orderController from '../controller/orderController.js'

router
    .get("/api/don-hang", orderController.getAllOrders)
    .get("/api/don-hang/:id", orderController.getOrderById)
    .get("/api/don-hang/transid/:id", orderController.getOrderByTransId)
    .post("/api/don-hang", orderController.addOrder)
    .put("/api/don-hang/:id", orderController.updateDonHang)
    .delete("/api/don-hang", orderController.deleteDonhang)

export default router;