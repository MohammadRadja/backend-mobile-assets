// routes/rekamMedisRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import rekamMedisController from "../controllers/rekammedisController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/admin/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);

// Routes untuk Pegawai
router.post(
  "/pegawai/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);

// Routes untuk Pemilik
router.get(
  "/pemilik/rekammedis",
  authenticateToken,
  isOwner,
  rekamMedisController.pemilikReadRekamMedis
);

export default router;
