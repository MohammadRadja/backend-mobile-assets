// routes/pemilikRoutes.js

import express from "express";
import { authenticateToken, isOwner } from "../middlewares/authMiddleware.js";
import pemilikController from "../controllers/pemilikController.js";

const router = express.Router();

// Middleware untuk memastikan akses hanya untuk pemilik
router.use(authenticateToken, isOwner);

// Routes untuk CRUD Pemilik
router.post("/pemilik", pemilikController.createPemilik);
router.get("/pemilik", pemilikController.getAllPemilik);
router.get("/pemilik/:id", pemilikController.getPemilikById);
router.put("/pemilik/:id", pemilikController.updatePemilik);
router.delete("/pemilik/:id", pemilikController.deletePemilik);

export default router;
