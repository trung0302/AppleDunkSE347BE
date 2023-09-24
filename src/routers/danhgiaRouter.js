import express from 'express'
const router=express.Router()
import * as danhgiaController from '../controller/danhgiaController.js'

router.get("/api/danhgia",danhgiaController.getAllDG)
router.post("/api/danhgia",danhgiaController.createDanhGia)
router.put("/api/danhgia/:id",danhgiaController.updateDanhGia)
router.delete("/api/danhgia/:id",danhgiaController.deleteDanhGia)
router.get("/api/danhgia/:id",danhgiaController.getDGBySP)

export default router;