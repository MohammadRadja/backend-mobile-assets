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
  doctorController.adminCRUDDokter
);
//GET -> READ
router.get(
  "/pegawai/doctor",
  authenticateToken,
  isEmployee,
  doctorController.adminCRUDDokter
);
//PUT -> UPDATE
router.put(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  doctorController.adminCRUDDokter
);
//DELETE
router.delete(
  "/pegawai/doctor/:id",
  authenticateToken,
  isEmployee,
  doctorController.adminCRUDDokter
);

// Routes untuk Pemilik
router.get(
  "/pemilik/doctor",
  authenticateToken,
  isOwner,
  doctorController.adminCRUDDokter
);

export default router;
