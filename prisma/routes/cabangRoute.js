import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import cabangController from "../controllers/cabangController.js";

const router = express.Router();

/**
 * @route POST /manajer/cabang
 * @desc Manajer: Membuat cabang baru
 * @access Private (Manajer)
 */
router.post(
  "/manajer/cabang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await cabangController.manajerCRUDCabang(req, res);
      console.log("Cabang berhasil dibuat oleh manajer:", result);
    } catch (error) {
      console.error("Gagal membuat cabang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /manajer/cabang
 * @desc Manajer: Mendapatkan daftar cabang
 * @access Private (Manajer)
 */
router.get(
  "/manajer/cabang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await cabangController.manajerCRUDCabang(req, res);
      console.log("Cabang berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan cabang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /manajer/cabang/:id
 * @desc Manajer: Mengedit cabang
 * @access Private (Manajer)
 */
router.put(
  "/manajer/cabang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await cabangController.manajerCRUDCabang(req, res);
      console.log("Cabang berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui cabang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /manajer/cabang/:id
 * @desc Manajer: Menghapus cabang
 * @access Private (Manajer)
 */
router.delete(
  "/manajer/cabang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await cabangController.manajerCRUDCabang(req, res);
      console.log("Cabang berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus cabang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas/cabang
 * @desc Petugas: Membuat cabang baru
 * @access Private (Petugas)
 */
router.post(
  "/petugas/cabang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await cabangController.petugasCRUDCabang(req, res);
      console.log("Cabang berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat cabang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/cabang
 * @desc Petugas: Mendapatkan daftar cabang
 * @access Private (Petugas)
 */
router.get(
  "/petugas/cabang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await cabangController.petugasCRUDCabang(req, res);
      console.log("Cabang berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan cabang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /petugas/cabang/:id
 * @desc Petugas: Mengedit cabang
 * @access Private (Petugas)
 */
router.put(
  "/petugas/cabang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await cabangController.petugasCRUDCabang(req, res);
      console.log("Cabang berhasil diperbarui oleh petugas:", result);
    } catch (error) {
      console.error("Gagal memperbarui cabang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /petugas/cabang/:id
 * @desc Petugas: Menghapus cabang
 * @access Private (Petugas)
 */
router.delete(
  "/petugas/cabang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await cabangController.petugasCRUDCabang(req, res);
      console.log("Cabang berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus cabang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/cabang
 * @desc Pegawai: Mendapatkan daftar cabang
 * @access Private (Pegawai)
 */
router.get(
  "/pegawai/cabang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await cabangController.pegawaiReadCabang(req, res);
      console.log("Cabang berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan cabang oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/cabang
 * @desc Pegawai: Mendapatkan daftar cabang
 * @access Private (Pegawai)
 */
router.post(
  "/pegawai/cabang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await cabangController.pegawaiReadCabang(req, res);
      console.log("Cabang berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan cabang oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
