import express from 'express'
const router=express.Router()
import * as recommendController from '../controller/recommendController.js'

router.get("/api/recommend", recommendController.recommendProducts)

export default router;