// routes/resepRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import resepController from "../controllers/resepController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/admin/resep",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);

// Routes untuk Pegawai
router.post(
  "/pegawai/resep",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);

// Routes untuk Pemilik
router.get(
  "/pemilik/resep",
  authenticateToken,
  isOwner,
  resepController.pemilikReadResep
);

export default router;
