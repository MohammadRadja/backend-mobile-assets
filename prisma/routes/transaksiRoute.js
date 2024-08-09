import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import pembayaranController from "../controllers/pembayaranController.js";

const router = express.Router();

/* Routes untuk Admin */
//POST -> CREATE
router.post(
  "/admin/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//GET -> READ
router.get(
  "/admin/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//PUT -> UPDATE
router.put(
  "/admin/pembayaran/:id",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//DELETE
router.delete(
  "/admin/pembayaran/:id",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);

/* Routes untuk Pegawai */
//POST -> CREATE
router.post(
  "/pegawai/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//GET -> READ
router.get(
  "/pegawai/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//PUT -> UPDATE
router.put(
  "/pegawai/pembayaran/:id",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//DELETE
router.delete(
  "/pegawai/pembayaran/:id",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);

/* Routes untuk Pemilik */

// CREATE
router.post(
  "/pemilik/pembayaran",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikCRUDPembayaran
);

// READ
router.get(
  "/pemilik/pembayaran",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikCRUDPembayaran
);

// UPDATE
router.put(
  "/pemilik/pembayaran/:id",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikCRUDPembayaran
);

// DELETE
router.delete(
  "/pemilik/pembayaran/:id",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikCRUDPembayaran
);

export default router;
