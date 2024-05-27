// routes/hewanRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import hewanController from "../controllers/hewanController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/hewan",
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

// Routes untuk Pegawai
router.post(
  "/hewan",
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

// Routes untuk Pemilik
router.get("/hewan", authenticateToken, hewanController.pemilikReadHewan);

export default router;
