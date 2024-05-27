// routes/obatRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import obatController from "../controllers/obatController.js";

const router = express.Router();

// Middleware untuk memastikan akses hanya untuk admin

// Routes untuk Admin
router.post("/obat", authenticateToken, isAdmin, obatController.adminCRUDObat);

// Routes untuk Pegawai
router.post(
  "/obat",
  authenticateToken,
  isEmployee,
  obatController.pegawaiCRUDobat
);

// Routes untuk Pemilik
router.get("/obat", authenticateToken, obatController.pemilikReadObat);

export default router;
