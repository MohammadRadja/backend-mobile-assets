// routes/resepRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import resepController from "../controllers/resepController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/resep",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);

// Routes untuk Pegawai
router.post(
  "/resep",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);

// Routes untuk Pemilik
router.get("/resep", authenticateToken, resepController.pemilikReadResep);

export default router;
