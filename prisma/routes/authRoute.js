import express from "express";
import authControllers from "../controllers/authControllers/authController.js";

const router = express.Router();

// Routes untuk login
router.post("/auth/login", authControllers.handleLogin);

// Routes untuk pendaftaran pemilik
router.post("/auth/register", authControllers.PegawaiRegister);

// Routes untuk pemilik forgot-password
router.post("/auth/forgot-password", authControllers.PegawaiForgotPassword);

export default router;
