// routes/obatRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import obatController from "../controllers/obatController.js";

const router = express.Router();

// Routes untuk Admin
router.post("/obat", authenticateToken, isAdmin, obatController.adminCRUDObat);

// Routes untuk Pegawai
router.post(
  "/obat",
  authenticateToken,
  isEmployee,
  obatController.pegawaiCRUDObat
);

// Routes untuk Pemilik
router.get("/obat", authenticateToken, obatController.PemilikReadObat);

export default router;
