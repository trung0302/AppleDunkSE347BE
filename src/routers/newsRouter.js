import express from 'express'
const router = express.Router()
import * as newsController from '../controller/newsController.js'
import { cachedAllNewsData, cachedNewsById } from '../middleware/redis.js'

router.get("/api/tin-tuc", newsController.getAllNews)
router.get("/api/tin-tuc/cached", cachedAllNewsData, newsController.getAllNewsCached)

router.get("/api/tin-tuc/:id", newsController.getNewsById)
router.get("/api/tin-tuc/cached/:id", cachedNewsById, newsController.getNewsByIdCached)

router.post("/api/tin-tuc", newsController.addNews)
router.put("/api/tin-tuc/:id", newsController.updateNews)
router.delete("/api/tin-tuc/:id", newsController.deleteNews)

export default router;