import express from 'express'
const router=express.Router()
import * as baohanhControler from "../controller/baohanhController.js"

router
    .get("/api/baohanh",baohanhControler.getAllBH)
    .get("/api/baohanh/:id",baohanhControler.getBHByID)
    .get("/api/baohanh/ctbh/:id/:ctbhId", baohanhControler.getCTBHByID)
    .get("/api/baohanh/sdt/:sdt",baohanhControler.getBHBySDT)
    .get("/api/baohanh/kh/:makh", baohanhControler.getBHByMakh)
    .post("/api/baohanh",baohanhControler.addBH)
    .post("/api/baohanh/ctbh/:id",baohanhControler.addCTBH)
    .put("/api/baohanh/:id",baohanhControler.updateBH)
    .put("/api/baohanh/ctbh/:id/:ctbhId",baohanhControler.updateCTBH)
    .delete("/api/baohanh/:id",baohanhControler.deleteBH)
    .delete("/api/baohanh/ctbh/:id/:ctbhId",baohanhControler.deleteCTBH)

export default router;