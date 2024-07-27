import express from "express";
import adminController from "../controllers/authControllers/adminController.js";
import pegawaiController from "../controllers/authControllers/pegawaiController.js";
import pemilikController from "../controllers/authControllers/pemilikController.js";

const router = express.Router();

// Routes untuk admin
router.post("/admin/login", adminController.AdminLogin);

// Routes untuk pegawai
router.post("/pegawai/login", pegawaiController.PegawaiLogin);

// Routes untuk pemilik
router.post("/pemilik/register", pemilikController.PemilikRegister);
router.post("/pemilik/login", pemilikController.PemilikLogin);
router.post(
  "/pemilik/forgot-password",
  pemilikController.PemilikForgotPassword
);

export default router;
