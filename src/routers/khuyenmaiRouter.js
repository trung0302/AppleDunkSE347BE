import express from 'express'
const router=express.Router()
import * as khuyenmaiController from "../controller/khuyenmaiController.js"
import { cachedAllPromotionsData, cachedPromotionById } from '../middleware/redis.js';

router
    .get("/api/khuyenmai",khuyenmaiController.getAllKM)
    .get("/api/khuyenmai/cached", cachedAllPromotionsData, khuyenmaiController.getAllKMcached)

    .get("/api/khuyenmai/:id",khuyenmaiController.getKMByID)
    .get("/api/khuyenmai/cached/:id", cachedPromotionById, khuyenmaiController.getKMByIdCached)
    .get('/api/khuyenmaibyMaKM/:makm', khuyenmaiController.getKMByMaKM)
    .get("/api/khuyenmai/apdung/:apdung",khuyenmaiController.getKMByApdung)
    .get("/api/khuyenmai/apdung&phantram/:apdung/:phantramkm",khuyenmaiController.getKMByApdungAndPhanTram)
    .post("/api/khuyenmai",khuyenmaiController.addKM)
    .put("/api/khuyenmai/:id",khuyenmaiController.updateKM)
    .delete("/api/khuyenmai/:id",khuyenmaiController.deleteKM)

export default router;