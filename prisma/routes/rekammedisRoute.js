// routes/rekamMedisRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import rekamMedisController from "../controllers/rekammedisController.js";

const router = express.Router();

/* Routes untuk Admin */
//POST -> CREATE
router.post(
  "/admin/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//GET -> READ
router.get(
  "/admin/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//PUT -> UPDATE
router.put(
  "/admin/rekammedis/:id",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//DELETE
router.delete(
  "/admin/rekammedis/:id",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);

/* Routes untuk Pegawai */
//POST -> CREATE
router.post(
  "/pegawai/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.adminCRUDRekamMedis
);
//GET -> READ
router.get(
  "/pegawai/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.adminCRUDRekamMedis
);
//PUT -> UPDATE
router.put(
  "/pegawai/rekammedis/:id",
  authenticateToken,
  isEmployee,
  rekamMedisController.adminCRUDRekamMedis
);
//DELETE
router.delete(
  "/pegawai/rekammedis/:id",
  authenticateToken,
  isEmployee,
  rekamMedisController.adminCRUDRekamMedis
);

// Routes untuk Pemilik
router.get(
  "/pemilik/rekammedis",
  authenticateToken,
  isOwner,
  rekamMedisController.pemilikReadRekamMedis
);

export default router;
