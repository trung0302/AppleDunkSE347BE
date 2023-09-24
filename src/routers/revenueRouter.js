import * as RevenueController from "../controller/revenueController.js";
import express from 'express';
const router=express.Router();
router
    .get("/api/percentTypeProduct", RevenueController.GetPercentProductType)
    .get("/api/totalRevenueByMonth",RevenueController.GetTotalRevenueByMonth);

export default router;