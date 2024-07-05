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
// POST
router.post(
  "/admin/resep",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);
// GET
router.get(
  "/admin/resep",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);
// PUT
router.put(
  "/admin/resep/:id",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);
router.delete(
  "/admin/resep/:id",
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep
);

// Routes untuk Pegawai
// POST
router.post(
  "/pegawai/resep",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);
// GET
router.get(
  "/pegawai/resep",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);
// PUT
router.put(
  "/pegawai/resep/:id",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);
// DELETE
router.delete(
  "/pegawai/resep",
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep
);

// Routes untuk Pemilik
// POST
router.post(
  "/pemilik/resep",
  authenticateToken,
  isOwner,
  resepController.pemilikReadResep
);

export default router;
