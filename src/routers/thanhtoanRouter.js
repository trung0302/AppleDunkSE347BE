import express from 'express'
const router=express.Router()
import * as thanhtoanController from '../controller/thanhtoanController.js'

router.post("/api/thanhtoan/momo",thanhtoanController.thanhtoanMoMo)
router.post("/api/thanhtoan/zalo",thanhtoanController.thanhtoanZalo)
router.post("/api/thanhtoan/checkZalo",thanhtoanController.checkZalo)
router.post("/api/thanhtoan/checkMomo",thanhtoanController.checkMomo)




export default router;