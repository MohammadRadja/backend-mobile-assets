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

export default router;
