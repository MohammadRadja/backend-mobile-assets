// routes/authRoutes.js

import express from "express";
import adminController from "../controllers/adminController.js";
import pegawaiController from "../controllers/pegawaiController.js";
import pemilikController from "../controllers/pemilikController.js";

const router = express.Router();

// Routes untuk admin
router.post("/admin/register", adminController.AdminRegister);
router.post("/admin/login", adminController.AdminLogin);

// Routes untuk pegawai
router.post("/pegawai/register", pegawaiController.PegawaiRegister);
router.post("/pegawai/login", pegawaiController.PegawaiLogin);

// Routes untuk pemilik
router.post("/pemilik/register", pemilikController.PemilikRegister);
router.post("/pemilik/login", pemilikController.PemilikLogin);

export default router;
