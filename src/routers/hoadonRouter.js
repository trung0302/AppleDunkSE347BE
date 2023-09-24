import express from 'express'
const router=express.Router()
import * as hoadonController from '../controller/hoadonController.js'

router.get("/api/hoa-don", hoadonController.getAllHoaDon)
router.get("/api/hoa-don/:id", hoadonController.getHoaDonById)
router.get("/api/hoa-don/hello", hoadonController.hello)
router.post("/api/hoa-don", hoadonController.addHoaDon)
router.delete("/api/hoa-don/:id", hoadonController.deleteHoaDon)
router.put("/api/hoa-don/:id",hoadonController.updateHoaDon)
// router.get("api/search", hoadonController.getProductsByName)
export default router