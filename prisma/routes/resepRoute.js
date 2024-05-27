// routes/resepRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import resepController from "../controllers/resepController.js";

const router = express.Router();

// Middleware untuk memastikan akses hanya untuk admin
router.use(authenticateToken, isAdmin);

// Routes untuk CRUD Resep
router.post("/resep", resepController.createResep);
router.get("/resep", resepController.getAllResep);
router.get("/resep/:id", resepController.getResepById);
router.put("/resep/:id", resepController.updateResep);
router.delete("/resep/:id", resepController.deleteResep);

export default router;
