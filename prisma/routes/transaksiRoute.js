import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import transaksiController from "../controllers/transaksiController.js";

const router = express.Router();

/**
 * @route GET /manajer/transaksi
 * @desc Manajer: Mendapatkan daftar transaksi
 * @access Private (manajer)
 */
router.get(
  "/manajer/transaksi",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await transaksiController.manajerReadTransaksi(req, res);
      console.log("Transaksi berhasil diambil oleh manajer:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal mendapatkan transaksi oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/transaksi
 * @desc Petugas: Mendapatkan daftar transaksi
 * @access Private (petugas)
 */
router.get(
  "/petugas/transaksi",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await transaksiController.petugasReadTransaksi(req, res);
      console.log("Transaksi berhasil diambil oleh petugas:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal mendapatkan transaksi oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/transaksi
 * @desc Pegawai: Mendapatkan daftar transaksi
 * @access Private (pegawai)
 */
router.get(
  "/pegawai/transaksi",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await transaksiController.pegawaiReadTransaksi(req, res);
      console.log("Transaksi berhasil diambil oleh pegawai:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal mendapatkan transaksi oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
