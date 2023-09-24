import express from "express";
const router = express.Router();
import * as storeController from "../controller/storeController.js";
import { cachedAllStoresData, cachedStoreById } from "../middleware/redis.js";

router.get("/api/store", storeController.getAllStores)
router.get("/api/store/cached", cachedAllStoresData, storeController.getAllStoresCached)

router.get("/api/store/province", storeController.getStoreByProvince)
router.get("/api/store/district", storeController.getStoreByDistrict)

router.get("/api/store/:id", storeController.getStoresById)
router.get("/api/store/cached/:id", cachedStoreById, storeController.getStoresByIdCached)

router.post("/api/store", storeController.addStore)
router.delete("/api/store/:id", storeController.deleteStore)
router.put("/api/store/:id", storeController.updateStore)

export default router;
