// routes/pegawaiRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import pegawaiController from "../controllers/pegawaiController.js";

const router = express.Router();

// Middleware untuk memastikan akses hanya untuk admin
router.use(authenticateToken, isAdmin);

// Routes untuk CRUD Pegawai
router.post("/pegawai", pegawaiController.createPegawai);
router.get("/pegawai", pegawaiController.getAllPegawai);
router.get("/pegawai/:id", pegawaiController.getPegawaiById);
router.put("/pegawai/:id", pegawaiController.updatePegawai);
router.delete("/pegawai/:id", pegawaiController.deletePegawai);

export default router;
