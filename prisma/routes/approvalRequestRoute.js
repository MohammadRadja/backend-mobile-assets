import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
} from "../middlewares/authMiddleware.js";
import approvalRequestController from "../controllers/approvalRequestController.js";

const router = express.Router();

/**
 * @route POST /manajer/approval
 * @desc Manajer: Persetujuan Permintaan
 * @access Private (Manajer)
 */
router.post(
  "/manajer/approval",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.approveByManajer(req, res);
      console.log("Approval berhasil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal Approval oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /manajer/rejected
 * @desc Manager: Penolakan Permintaan
 * @access Private (Petugas)
 */
router.post(
  "/manajer/rejected",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.rejectedByManajer(
        req,
        res
      );
      console.log("Rejected berhasil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal Rejected oleh manajer:", error);
      next(error);
    }
  }
);
/**
 * @route GET /approval
 * @desc Menampilkan data approval
 * @access Private
 */
router.post(
  "/data/manajer/approval/",
  authenticateToken,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.ApprovalReadByManajer(
        req,
        res
      );
      console.log("Data approval berhasil ditampilkan oleh manajer:", result);
      return result; // Mengembalikan hasil data approval ke pengguna
    } catch (error) {
      console.error("Gagal menampilkan data approval oleh manajer:", error);
      next(error); // Mengirim error ke middleware error handler
    }
  }
);

/**
 * @route POST /petugas/approval
 * @desc Petugas: Persetujuan Permintaan
 * @access Private (Petugas)
 */
router.post(
  "/petugas/approval",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.approveByPetugas(req, res);
      console.log("Approval berhasil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal Approval oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas/rejected
 * @desc Petugas: Penolakan Permintaan
 * @access Private (Petugas)
 */
router.post(
  "/petugas/rejected",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.rejectedByPetugas(
        req,
        res
      );
      console.log("Rejected berhasil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal Rejected oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /approval
 * @desc Menampilkan data approval
 * @access Private
 */
router.post(
  "/data/petugas/approval/",
  authenticateToken,
  async (req, res, next) => {
    try {
      const result = await approvalRequestController.ApprovalReadByPetugas(
        req,
        res
      );
      console.log("Data approval berhasil ditampilkan oleh petugas:", result);
      return result; // Mengembalikan hasil data approval ke pengguna
    } catch (error) {
      console.error("Gagal menampilkan data approval oleh petugas:", error);
      next(error); // Mengirim error ke middleware error handler
    }
  }
);

export default router;
