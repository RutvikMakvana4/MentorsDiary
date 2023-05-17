import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getdata,
  logOut,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verifyotp", verifyOTP);
router.post("/reset-password", resetPassword);

router.get("/get-data", authMiddleware, getdata);

router.post("/logout", authMiddleware, logOut);

export default router;
