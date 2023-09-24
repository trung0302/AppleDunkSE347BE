import express from 'express';
const router=express.Router();
import * as productController from '../controller/productController.js';
router
    .get("/api/product", productController.getAllProducts)
    

    .get("/api/product/subcategory/:loaisanpham", productController.getAllSubCategory)

    .get("/api/product/:id", productController.getProductById)
    .post("/api/product", productController.addProduct)
    .put("/api/product/:id", productController.updateProduct)
    .delete("/api/product/:id", productController.deleteProduct)

export default router;
