import express from 'express'
//import passport from 'passport'
import * as auth from '../middleware/auth.js'
const router=express.Router()
import * as nhanvienController from '../controller/nhanvienController.js'
import NhanVien from '../models/nhanvien.js'

router.get("/api/nhanvien",nhanvienController.getAllNV)
router.post("/api/nhanvien",/*auth.authADNV,*/nhanvienController.addNV)
router.post("/api/nhanvien/login",nhanvienController.login)
router.get("/api/nhanvien/:id", nhanvienController.findById)
router.put("/api/nhanvien/:id", nhanvienController.updateNhanVien)
router.delete("/api/nhanvien/:id", nhanvienController.deleteNhanVien)

export default router;