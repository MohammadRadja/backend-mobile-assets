import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import dataPemilikController from "../controllers/dataPemilikController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/pemilik",
  authenticateToken,
  isAdmin,
  dataPemilikController.adminCRUDDataPemilik
);
//GET -> READ
router.get(
  "/admin/pemilik",
  authenticateToken,
  isAdmin,
  dataPemilikController.adminCRUDDataPemilik
);
//PUT -> UPDATE
router.put(
  "/admin/pemilik/:id",
  authenticateToken,
  isAdmin,
  dataPemilikController.adminCRUDDataPemilik
);
//DELETE
router.delete(
  "/admin/pemilik/:id",
  authenticateToken,
  isAdmin,
  dataPemilikController.adminCRUDDataPemilik
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/pemilik",
  authenticateToken,
  isEmployee,
  dataPemilikController.pegawaiCRUDDataPemilik
);
//GET -> READ
router.get(
  "/pegawai/pemilik",
  authenticateToken,
  isEmployee,
  dataPemilikController.pegawaiCRUDDataPemilik
);
//PUT -> UPDATE
router.put(
  "/pegawai/pemilik/:id",
  authenticateToken,
  isEmployee,
  dataPemilikController.pegawaiCRUDDataPemilik
);
//DELETE
router.delete(
  "/pegawai/pemilik/:id",
  authenticateToken,
  isEmployee,
  dataPemilikController.pegawaiCRUDDataPemilik
);

// Routes untuk Pemilik
//POST -> CREATE
router.post(
  "/pemilik/pemilik",
  authenticateToken,
  isEmployee,
  dataPemilikController.pemilikCRUDDataPemilik
);
//GET -> READ
router.get(
  "/pemilik/pemilik",
  authenticateToken,
  isEmployee,
  dataPemilikController.pemilikCRUDDataPemilik
);
//PUT -> UPDATE
router.put(
  "/pemilik/pemilik/:id",
  authenticateToken,
  isEmployee,
  dataPemilikController.pemilikCRUDDataPemilik
);

export default router;
