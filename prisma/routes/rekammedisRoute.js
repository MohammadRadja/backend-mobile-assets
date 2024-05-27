// routes/rekamMedisRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import rekamMedisController from "../controllers/rekammedisController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);

// Routes untuk Pegawai
router.post(
  "/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);

// Routes untuk Pemilik
router.get(
  "/rekammedis",
  authenticateToken,
  rekamMedisController.pemilikReadRekamMedis
);

export default router;
