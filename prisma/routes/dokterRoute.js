import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import dokterController from "../controllers/dokterController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/doctor",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter
);
//GET -> READ
router.get(
  "/admin/doctor",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter
);
//PUT -> UPDATE
router.put(
  "/admin/doctor/:id",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter
);
//DELETE
router.delete(
  "/admin/doctor/:id",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/doctor",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter
);
//GET -> READ
router.get(
  "/pegawai/doctor",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter
);
//PUT -> UPDATE
router.put(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter
);
//DELETE
router.delete(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter
);

// Routes untuk Pemilik
router.post(
  "/pemilik/doctor",
  authenticateToken,
  isOwner,
  dokterController.pemilikReadDokter
);

export default router;
