import express from 'express';
const router=express.Router();
import * as excelController from '../controller/excelController.js';
router
    .post("/api/importProductExcel", excelController.ImportProductExcel)
    .get("/api/exportProductExcel", excelController.ExportProductExcel)
    .get("/api/exportInvoiceExcel", excelController.ExportInvoiceExcel)
    .get("/api/exportPromotionExcel", excelController.ExportPromotionExcel)


export default router;