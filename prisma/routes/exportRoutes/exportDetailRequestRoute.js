import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
} from "../../middlewares/authMiddleware.js";
import exportDetailRequestController from "../../controllers/Export/exportDetailRequestController.js";

const router = express.Router();

/**
 * @route GET /manajer/exportDetaiRequest/pdf
 * @desc manajer: Mendapatkan Laporan daftar detail request PDF
 * @access Private (manajer)
 */
router.get(
  "/manajer/exportDetailRequest/pdf",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result =
        await exportDetailRequestController.exportDetailRequestToPDF(req, res);
      console.log("Laporan Detail Request PDF berhasil diambil oleh manajer");
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Detail PDF Request oleh manajer:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /manajer/exportDetaiRequest/excel
 * @desc manajer: Mendapatkan Laporan daftar detail request Excel
 * @access Private (manajer)
 */
router.get(
  "/manajer/exportDetailRequest/excel",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result =
        await exportDetailRequestController.exportDetailRequestToExcel(
          req,
          res
        );
      console.log(
        "Laporan Detail Request Excel berhasil diambil oleh manajer:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Detail Request Excel oleh manajer:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /petugas/exportDetaiRequest/pdf
 * @desc petugas: Mendapatkan Laporan daftar detail request PDF
 * @access Private (petugas)
 */
router.get(
  "/petugas/exportDetailRequest/pdf",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result =
        await exportDetailRequestController.exportDetailRequestToPDF(req, res);
      console.log(
        "Laporan Detail Request PDF berhasil diambil oleh petugas:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Detail Request PDF oleh petugas:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /petugas/exportDetaiRequest/excel
 * @desc petugas: Mendapatkan Laporan daftar detail request Excel
 * @access Private (petugas)
 */
router.get(
  "/petugas/exportDetailRequest/excel",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result =
        await exportDetailRequestController.exportDetailRequestToExcel(
          req,
          res
        );
      console.log(
        "Laporan Detail Request PDF berhasil diambil oleh petugas:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Detail Request Excel oleh petugas:",
        error
      );
      next(error);
    }
  }
);

export default router;
