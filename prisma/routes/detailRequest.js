import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import detailRequestController from "../controllers/detailrequestController.js";

const router = express.Router();

/**
 * @route GET /manajer/detail-request
 * @desc manajer: Mendapatkan daftar detail request
 * @access Private (manajer)
 */
router.get(
  "/manajer/detail-request",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await detailRequestController.manajerReadDetailRequest(
        req,
        res
      );
      console.log("Detail request berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan detail request oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/detail-request
 * @desc petugas: Mendapatkan daftar detail request
 * @access Private (petugas)
 */
router.get(
  "/petugas/detail-request",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await detailRequestController.petugasReadDetailRequest(
        req,
        res
      );
      console.log("Detail request berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan detail request oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/detail-request
 * @desc pegawai: Mendapatkan daftar detail request
 * @access Private (pegawai)
 */
router.get(
  "/pegawai/detail-request",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await detailRequestController.pegawaiReadDetailRequest(
        req,
        res
      );
      console.log("Detail request berhasil diambil oleh pegawai:", result);
    } catch (error) {
      console.error("Gagal mendapatkan detail request oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
