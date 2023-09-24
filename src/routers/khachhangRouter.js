import express from 'express'
import passport from 'passport'
import * as auth from '../middleware/auth.js'
//import * as image from '../middleware/uploadImage.js'
import { uploadPhoto, userImgResize } from '../middleware/uploadImage.js'
const router=express.Router()
import * as khachhangController from '../controller/khachhangController.js'

router.get("/api/auth",khachhangController.getAllKH)
router.get("/api/auth/me",auth.auth,khachhangController.getMe)
router.get("/api/auth/:id",khachhangController.findById)
router.post("/api/auth",khachhangController.addKH)
router.delete("/api/auth/:id",khachhangController.deleteKhachHang0)
router.put("/api/auth/:id",khachhangController.updateKH)
router.put("/api/auth/password/:id",khachhangController.ChangePassword)
router.post("/api/auth/login",khachhangController.login)
router.post("/api/auth/upload/:id", 
          uploadPhoto.array("images", 10),
          userImgResize,
          khachhangController.uploadImages)

router.post("/api/auth/adress/:id",khachhangController.AddNewAdress) 
router.delete("/api/auth/adress/:id",auth.auth,khachhangController.DeleteAdress) 
router.put("/api/auth/adress/:id",auth.auth,khachhangController.UpdateAdress) 


router.post("/api/auth/googlelogin",khachhangController.googleLogin)
router.post("/api/auth/forgetpass",khachhangController.forgotPassword)
router.post("/api/auth/resetpass",khachhangController.resetPassword)
router.post("/api/auth/facebook",khachhangController.faceBookLogin)



router.get("/api/auth/facebook", passport.authenticate("facebook"));

router.get(
    "/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function(req, res) {
      console.log("i am in fb callback");
      // Kiểm tra xem người dùn đã đăng nhập thành công hay chưa
      if (req.user) {
        // Thực hiện các thao tác tiếp theo, chẳng hạn đăng nhập vào hệ thống của bạn, lưu thông tin người dùng vào session, ...
        // Sau đó, chuyển hướng đến trang profile của người dùng
        res.redirect("login");
      } else {
        // Nếu không thành công, chuyển hướng đến trang đăng nhập lại
        res.redirect("login");
      }
    }
  );

router.put("/api/auth/:id", khachhangController.updateKH)


export default router;


// facebook routes
/*
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("i am in fb callback");
    // Successful authentication, redirect home.
    //res.redirect("/profile");
  }
);
*/