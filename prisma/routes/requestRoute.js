import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import requestController from "../controllers/requestController.js";

const router = express.Router();

/**
 * @route POST /manajer/request
 * @desc Manajer: Membuat request baru
 * @access Private (Manajer)
 */
router.post(
  "/manajer/request",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await requestController.manajerCRUDRequest(req, res);
      console.log("Request berhasil dibuat oleh manajer:", result);
    } catch (error) {
      console.error("Gagal membuat request oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /manajer/request
 * @desc Manajer: Mendapatkan daftar request
 * @access Private (Manajer)
 */
router.get(
  "/manajer/request",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await requestController.manajerCRUDRequest(req, res);
      console.log("Request berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan request oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /manajer/request/:id
 * @desc Manajer: Mengedit request
 * @access Private (Manajer)
 */
router.put(
  "/manajer/request/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await requestController.manajerCRUDRequest(req, res);
      console.log("Request berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui request oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /manajer/request/:id
 * @desc Manajer: Menghapus request
 * @access Private (Manajer)
 */
router.delete(
  "/manajer/request/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await requestController.manajerCRUDRequest(req, res);
      console.log("Request berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus request oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas/request
 * @desc Petugas: Membuat request baru
 * @access Private (Petugas)
 */
router.post(
  "/petugas/request",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await requestController.petugasCRUDRequest(req, res);
      console.log("Request berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat request oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/request
 * @desc Petugas: Mendapatkan daftar request
 * @access Private (Petugas)
 */
router.get(
  "/petugas/request",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await requestController.petugasCRUDRequest(req, res);
      console.log("Request berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan request oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /petugas/request/:id
 * @desc Petugas: Mengedit request
 * @access Private (Petugas)
 */
router.put(
  "/petugas/request/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await requestController.petugasCRUDRequest(req, res);
      console.log("Request berhasil diperbarui oleh petugas:", result);
    } catch (error) {
      console.error("Gagal memperbarui request oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /petugas/request/:id
 * @desc Petugas: Menghapus request
 * @access Private (Petugas)
 */
router.delete(
  "/petugas/request/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await requestController.petugasCRUDRequest(req, res);
      console.log("Request berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus request oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/request
 * @desc Pegawai: Membuat request baru
 * @access Private (Pegawai)
 */
router.post(
  "/pegawai/request",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await requestController.pegawaiCRUDRequest(req, res);
      console.log("Request berhasil dibuat oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal membuat request oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/request
 * @desc Pegawai: Mendapatkan daftar request berdasarkan ID Pegawai
 * @access Private (Pegawai)
 */
router.post(
  "/pegawai/request",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    req.body.action = "read";
    req.body.data = { id_user: idPegawai || req.params.id };
    try {
      const result = await requestController.pegawaiCRUDRequest(req, res);
      console.log("Request berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan request oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /pegawai/request/:id
 * @desc Pegawai: Mengedit request
 * @access Private (Pegawai)
 */
router.put(
  "/pegawai/request/:id",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await requestController.pegawaiCRUDRequest(req, res);
      console.log("Request berhasil diperbarui oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal memperbarui request oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /pegawai/request/:id
 * @desc Pegawai: Menghapus request
 * @access Private (Pegawai)
 */
router.delete(
  "/pegawai/request/:id",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await requestController.pegawaiCRUDRequest(req, res);
      console.log("Request berhasil dihapus oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal menghapus request oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
