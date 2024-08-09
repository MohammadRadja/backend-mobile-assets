import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../../middlewares/authMiddleware.js";
import dataPegawaiController from "../../controllers/dataUserControllers/dataPegawaiController.js";

const router = express.Router();

/**
 * @route POST /Manajer
 * @desc Manajer: Membuat data pegawai baru
 * @access Private (manajer)
 */
router.post(
  "/manajer/pegawai",
  authenticateToken,
  isManager,
  dataPegawaiController.manajerCRUDDataPegawai
);

/**
 * @route GET /Manager
 * @desc Manager: Mendapatkan daftar data pegawai
 * @access Private (manajer)
 */
router.post(
  "/manajer/pegawai",
  authenticateToken,
  isManager,
  dataPegawaiController.manajerCRUDDataPegawai
);

/**
 * @route PUT /Manager/pegawai/:id
 * @desc Manager: Mengedit data pegawai
 * @access Private (manajer)
 */
router.put(
  "/manajer/pegawai/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    req.body.action = "update";
    req.body.data = { id_user: req.params.id };
    try {
      const result = await dataPegawaiController.manajerCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui data pegawai oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /Manager/pegawai/:id
 * @desc Manager: Menghapus data pegawai
 * @access Private (Manajer)
 */
router.delete(
  "/manajer/pegawai/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    req.body.action = "delete";
    req.body.data = { id_user: req.params.id };
    try {
      const result = await dataPegawaiController.manajerCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus data pegawai oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai
 * @desc pegawai: Membuat data pegawai baru
 * @access Private (pegawai)
 */
router.post(
  "/petugas/pegawai",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "create";
    try {
      const result = await dataPegawaiController.petugasCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat data pegawai oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai
 * @desc Petugas: Mendapatkan daftar data pegawai
 * @access Private (petugas)
 */
router.get(
  "/petugas/pegawai",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "read";
    try {
      const result = await dataPegawaiController.petugasCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data pegawai oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /pegawai/:id
 * @desc Petugas: Mengedit data pegawai
 * @access Private (petugas)
 */
router.put(
  "/petugas/pegawai/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "update";
    req.body.data = { ...req.body.data, id_user: req.params.id };
    try {
      const result = await dataPegawaiController.petugasCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil diperbarui oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal memperbarui data pegawai oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /pegawai/:id
 * @desc pegawai: Menghapus data pegawai
 * @access Private (pegawai)
 */
router.delete(
  "/petugas/pegawai/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "delete";
    req.body.data = { id_user: req.params.id };
    try {
      const result = await dataPegawaiController.petugasCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus data pegawai oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/pegawai
 * @desc Pegawai: Melihat data pegawai berdasarkan id
 * @access Private (Pegawai)
 */
router.post(
  "/pegawai/pegawai",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    req.body.action = "read";
    try {
      const result = await dataPegawaiController.pegawaiReadDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data pegawai oleh pegawai:", error);
      next(error);
    }
  }
);
/**
 * @route PUT /pegawai/pegawai/:id
 * @desc Petugas: Mengedit data pegawai
 * @access Private (petugas)
 */
router.put(
  "/pegawai/pegawai/:id",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    req.body.action = "update";
    req.body.data = { ...req.body.data, id_user: idPegawai || req.params.id };
    try {
      const result = await dataPegawaiController.petugasCRUDDataPegawai(
        req,
        res
      );
      console.log("Data pegawai berhasil diperbarui oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal memperbarui data pegawai oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
