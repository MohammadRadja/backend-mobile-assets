import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import hewanController from "../controllers/hewanController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/admin/hewan",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

// Routes untuk Pegawai
router.post(
  "/pegawai/hewan",
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

// Routes untuk Pemilik
router.get(
  "/pemilik/hewan",
  authenticateToken,
  isOwner,
  hewanController.pemilikReadHewan
);

export default router;
