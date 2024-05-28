// routes/pembayaranRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import pembayaranController from "../controllers/pembayaranController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/admin/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);

// Routes untuk Pegawai
router.post(
  "/pegawai/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);

// Routes untuk Pemilik
router.get(
  "/pemilik/pembayaran",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikReadPembayaran
);

export default router;
