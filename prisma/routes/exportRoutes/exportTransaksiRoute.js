import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
} from "../../middlewares/authMiddleware.js";
import exportTransaksiController from "../../controllers/Export/exportTransaksiController.js";

const router = express.Router();

/**
 * @route GET /manajer/exportTransaksi/pdf
 * @desc manajer: Mendapatkan Laporan daftar transaksi PDF
 * @access Private (manajer)
 */
router.get(
  "/manajer/exportTransaksi/pdf",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await exportTransaksiController.exportTransaksiToPDF(
        req,
        res
      );
      console.log(
        "Laporan Transaksi PDF berhasil diambil oleh manajer:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Transaksi PDF oleh manajer:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /manajer/exportTransaksi/excel
 * @desc manajer: Mendapatkan Laporan daftar transaksi Excel
 * @access Private (manajer)
 */
router.get(
  "/manajer/exportTransaksi/excel",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await exportTransaksiController.exportTransaksiToExcel(
        req,
        res
      );
      console.log(
        "Laporan Transaksi Excel berhasil diambil oleh manajer:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Transaksi Excel oleh manajer:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /petugas/exportTransaksi/pdf
 * @desc petugas: Mendapatkan Laporan daftar transaksi PDF
 * @access Private (petugas)
 */
router.get(
  "/petugas/exportTransaksi/pdf",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await exportTransaksiController.exportTransaksiToPDF(
        req,
        res
      );
      console.log(
        "Laporan Transaksi PDF berhasil diambil oleh petugas:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Transaksi PDF oleh petugas:",
        error
      );
      next(error);
    }
  }
);

/**
 * @route GET /petugas/exportTransaksi/excel
 * @desc petugas: Mendapatkan Laporan daftar transaksi Excel
 * @access Private (petugas)
 */
router.get(
  "/petugas/exportTransaksi/excel",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await exportTransaksiController.exportTransaksiToExcel(
        req,
        res
      );
      console.log(
        "Laporan Transaksi Excel berhasil diambil oleh petugas:",
        result
      );
    } catch (error) {
      console.error(
        "Gagal mendapatkan Laporan Transaksi Excel oleh petugas:",
        error
      );
      next(error);
    }
  }
);

export default router;
