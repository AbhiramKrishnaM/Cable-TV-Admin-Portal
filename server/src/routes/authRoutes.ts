import express from "express";
import {
  signup,
  signin,
  getProfile,
  changePassword,
  logout,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import {
  validateSignup,
  validateSignin,
  validatePasswordChange,
} from "../middleware/validation";

const router = express.Router();

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put(
  "/change-password",
  authenticate,
  validatePasswordChange,
  changePassword
);
router.post("/logout", authenticate, logout);

export default router;
