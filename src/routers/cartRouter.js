import express from "express";
const router = express.Router();
import * as cartController from "../controller/cartController.js";

router
    .get("/api/cart", cartController.getCartByMaKH)
    // .get("/api/cart", cartController.getCartByMaKH)
    // .get("/cartNoCached", cartController.getCartNoCached)
    .post("/api/cart", cartController.addSpToCart)
    .delete("/api/cart", cartController.deleteSp)
    .put("/api/cart", cartController.updateCart)
    .delete("/api/cart/deleteAll", cartController.deleteAllSp)
    .delete("/api/cart/:id", cartController.deleteGH);

export default router;
