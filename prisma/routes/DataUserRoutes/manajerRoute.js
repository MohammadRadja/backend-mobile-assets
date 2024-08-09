import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../../middlewares/authMiddleware.js";
import dataManajerController from "../../controllers/dataUserControllers/dataManajerController.js";

const router = express.Router();
/**
 * @route POST /manajer/manajer
 * @desc Manajer: Mendapatkan daftar data manajer berdasarkan ID Manager
 * @access Private (Manajer)
 */
router.post(
  "/manajer/manajer",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await dataManajerController.ManajerCRUDDataManajer(
        req,
        res
      );
      console.log("Data manajer berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data manajer oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /manajer/manajer/:id
 * @desc Manajer: Mengedit data manajer
 * @access Private (Manajer)
 */
router.put(
  "/manajer/manajer/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await dataManajerController.ManajerCRUDDataManajer(
        req,
        res
      );
      console.log("Data manajer berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui data manajer oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/manajer
 * @desc Petugas: Melihat data manajer
 * @access Private (Petugas)
 */
router.get(
  "/petugas/manajer",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await dataManajerController.petugasReadDataManajer(
        req,
        res
      );
      console.log("Data manajer berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data manajer oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/manajer
 * @desc Pegawai: Melihat data manajer
 * @access Private (Pegawai)
 */
router.get(
  "/pegawai/manajer",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await dataManajerController.pegawaiReadDataManajer(
        req,
        res
      );
      console.log("Data manajer berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan data manajer oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
