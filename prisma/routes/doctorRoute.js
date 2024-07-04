import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import doctorController from "../controllers/doctorController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/doctor",
  authenticateToken,
  isAdmin,
  doctorController.adminCRUDDokter
);
//GET -> READ
router.get(
  "/admin/doctor",
  authenticateToken,
  isAdmin,
  doctorController.adminCRUDDokter
);
//PUT -> UPDATE
router.put(
  "/admin/doctor/:id",
  authenticateToken,
  isAdmin,
  doctorController.adminCRUDDokter
);
//DELETE
router.delete(
  "/admin/doctor/:id",
  authenticateToken,
  isAdmin,
  doctorController.adminCRUDDokter
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/doctor",
  authenticateToken,
  isEmployee,
  doctorController.pegawaiCRUDDokter
);
//GET -> READ
router.get(
  "/pegawai/doctor",
  authenticateToken,
  isEmployee,
  doctorController.pegawaiCRUDDokter
);
//PUT -> UPDATE
router.put(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  doctorController.pegawaiCRUDDokter
);
//DELETE
router.delete(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  doctorController.pegawaiCRUDDokter
);

// Routes untuk Pemilik
router.post(
  "/pemilik/doctor",
  authenticateToken,
  isOwner,
  doctorController.pemilikReadDokter
);

export default router;
