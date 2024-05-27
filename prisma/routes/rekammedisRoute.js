// routes/rekamMedisRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import rekamMedisController from "../controllers/rekammedisController.js";

const router = express.Router();

// Middleware untuk memastikan akses hanya untuk admin
router.use(authenticateToken, isAdmin);

// Routes untuk CRUD Rekam Medis
router.post("/rekam-medis", rekamMedisController.createRekamMedis);
router.get("/rekam-medis", rekamMedisController.getAllRekamMedis);
router.get("/rekam-medis/:id", rekamMedisController.getRekamMedisById);
router.put("/rekam-medis/:id", rekamMedisController.updateRekamMedis);
router.delete("/rekam-medis/:id", rekamMedisController.deleteRekamMedis);

export default router;
