import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import hewanController from "../controllers/hewanController.js";

const router = express.Router();

/* Routes untuk Admin */
// POST -> CREATE
router.post(
  "/admin/hewan",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);
// GET - READ
router.get(
  "/admin/hewan",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);
// PUT -> EDIT
router.put(
  "/admin/hewan/:id",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);
//DELETE _
router.delete(
  "/admin/hewan/:id",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/hewan",
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);
//GET -> READ
router.get(
  "/pegawai/hewan",
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);
//PUT -> EDIT
router.put(
  "/pegawai/hewan/:id",
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);
//DELETE
router.delete(
  "/pegawai/hewan/:id",
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
