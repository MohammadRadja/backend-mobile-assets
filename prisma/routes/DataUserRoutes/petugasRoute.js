import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../../middlewares/authMiddleware.js";
import dataPetugasController from "../../controllers/dataUserControllers/dataPetugasController.js";

const router = express.Router();

/**
 * @route POST /Manajer
 * @desc Manajer: Membuat data petugas baru
 * @access Private (manajer)
 */
router.post(
  "/manajer/petugas",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    req.body.action = "create";
    try {
      const result = await dataPetugasController.manajerCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil dibuat oleh manajer:", result);
    } catch (error) {
      console.error("Gagal membuat data petugas oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /Manager
 * @desc Manager: Mendapatkan daftar data petugas
 * @access Private (manajer)
 */
router.post(
  "/manajer/petugas",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    req.body.action = "read";
    try {
      const result = await dataPetugasController.manajerCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data petugas oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /Manager/Petugas/:id
 * @desc Manager: Mengedit data petugas
 * @access Private (manajer)
 */
router.put(
  "/manajer/petugas/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    req.body.action = "update";
    req.body.data = { ...req.body.data, id_user: req.params.id };
    try {
      const result = await dataPetugasController.manajerCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui data petugas oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /Manager/Petugas/:id
 * @desc Manager: Menghapus data petugas
 * @access Private (Manajer)
 */
router.delete(
  "/manajer/petugas/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "delete";
    req.body.data = { id_user: req.params.id };
    try {
      const result = await dataPetugasController.manajerCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus data petugas oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas
 * @desc Petugas: Membuat data petugas baru
 * @access Private (Petugas)
 */
router.post(
  "/petugas/petugas",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "create";
    try {
      const result = await dataPetugasController.petugasCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat data petugas oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas
 * @desc Petugas: Mendapatkan data petugas berdasarkan id
 * @access Private (Petugas)
 */
router.post(
  "/petugas/petugas",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "read";
    req.body.data = { id_user: idPetugas || req.params.id };
    try {
      const result = await dataPetugasController.petugasCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data petugas oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /petugas/:id
 * @desc Petugas: Mengedit data petugas
 * @access Private (Petugas)
 */
router.put(
  "/petugas/petugas/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "update";
    req.body.data = { ...req.body.data, id_user: idPetugas || req.params.id };
    try {
      const result = await dataPetugasController.petugasCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil diperbarui oleh petugas:", result);
    } catch (error) {
      console.error("Gagal memperbarui data petugas oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /petugas/:id
 * @desc Petugas: Menghapus data petugas
 * @access Private (Petugas)
 */
router.delete(
  "/petugas/petugas/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    req.body.action = "delete";
    req.body.data = { id_user: idPetugas || req.params.id };
    try {
      const result = await dataPetugasController.petugasCRUDDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus data petugas oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/petugas
 * @desc Pegawai: Melihat data petugas
 * @access Private (Pegawai)
 */
router.get(
  "/pegawai/petugas",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await dataPetugasController.pegawaiReadDataPetugas(
        req,
        res
      );
      console.log("Data petugas berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data petugas oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
