import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import barangController from "../controllers/barangController.js";

const router = express.Router();

/**
 * @route POST /manajer/barang
 * @desc Manajer: Membuat barang baru
 * @access Private (Manajer)
 */
router.post(
  "/manajer/barang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await barangController.manajerCRUDBarang(req, res);
      console.log("Barang berhasil dibuat oleh manajer:", result);
    } catch (error) {
      console.error("Gagal membuat barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /manajer/barang
 * @desc manajer: Mendapatkan daftar barang
 * @access Private (manajer)
 */
router.get(
  "/manajer/barang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await barangController.manajerCRUDBarang(req, res);
      console.log("Barang berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /manajer/barang/:id
 * @desc manajer: Mengedit barang
 * @access Private (manajer)
 */
router.put(
  "/manajer/barang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await barangController.manajerCRUDBarang(req, res);
      console.log("Barang berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /manajer/barang/:id
 * @desc manajer: Menghapus barang
 * @access Private (manajer)
 */
router.delete(
  "/manajer/barang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await barangController.manajerCRUDBarang(req, res);
      console.log("Barang berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas/barang
 * @desc petugas: Membuat barang baru
 * @access Private (petugas)
 */
router.post(
  "/petugas/barang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await barangController.petugasCRUDBarang(req, res);
      console.log("Barang berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/barang
 * @desc petugas: Mendapatkan daftar barang
 * @access Private (petugas)
 */
router.get(
  "/petugas/barang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await barangController.petugasCRUDBarang(req, res);
      console.log("Barang berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /petugas/barang/:id
 * @desc petugas: Mengedit barang
 * @access Private (petugas)
 */
router.put(
  "/petugas/barang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await barangController.petugasCRUDBarang(req, res);
      console.log("Barang berhasil diperbarui oleh petugas:", result);
    } catch (error) {
      console.error("Gagal memperbarui barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /petugas/barang/:id
 * @desc petugas: Menghapus barang
 * @access Private (petugas)
 */
router.delete(
  "/petugas/barang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await barangController.petugasCRUDBarang(req, res);
      console.log("Barang berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/barang
 * @desc pegawai: Mendapatkan daftar barang
 * @access Private (pegawai)
 */
router.get(
  "/pegawai/barang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await barangController.pegawaiReadBarang(req, res);
      console.log("Barang berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan barang oleh pegawai:", error);
      next(error);
    }
  }
);
/**
 * @route POST /pegawai/barang
 * @desc pegawai: Mendapatkan daftar barang
 * @access Private (pegawai)
 */
router.post(
  "/pegawai/barang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await barangController.pegawaiReadBarang(req, res);
      console.log("Barang berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan barang oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
