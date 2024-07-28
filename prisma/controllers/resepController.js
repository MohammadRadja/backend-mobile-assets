// controllers/resepController.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resepController = {
  // Admin: CRUD semua tabel
  adminCRUDResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { user } = req;
      console.log("User role in isAdmin:", user.role);

      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action diterima:", action);
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      switch (action) {
        case "create":
          try {
            // Buat Data Baru
            result = await prisma.resep.create({
              data: {
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
          } catch (error) {
            if (error.code === "P2002") {
              // Prisma error code for unique constraint violation
              return res.status(400).json({
                success: false,
                message: "Resep dengan id_rekam_medis ini sudah ada.",
              });
            }
            console.error("Create Resep failed:", error);
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }
          break;

        case "read":
          console.log("Read operation");
          result = await prisma.resep.findMany({
            orderBy: {
              id_resep: "asc",
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          });
          console.log("Read Resep successful:", result);
          break;

        case "update":
          console.log("Update operation");

          const {
            id_resep: idResepToUpdate,
            id_rekam_medis: idRekamMedisToUpdate,
            id_obat: idObatToUpdate,
            jumlah_obat,
          } = data; // Extract ids and update data

          // Prepare the // Prepare the update payload
          const updatePayloadResep = {
            where: { id_resep: idResepToUpdate },
            data: {
              id_rekam_medis: idRekamMedisToUpdate,
              id_obat: idObatToUpdate,
              jumlah_obat: jumlah_obat,
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          };

          try {
            // Execute the update operation
            result = await prisma.resep.update(updatePayloadResep);
            console.log("Update Resep successful:", result);
          } catch (error) {
            // Handle any errors during the update operation
            console.error("Update Resep failed:", error);
            throw new Error("Failed to update resep");
          }
          break;

        case "delete":
          console.log("Delete operation");
          result = await prisma.resep.delete({
            where: { id_resep: data.id_resep },
          });
          console.log("Delete Resep successful:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      console.log("Operation success:", action, result);
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      console.error("Operation failed:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { user } = req;
      console.log("User role in isEmployee:", user.role);

      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action diterima:", action);
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      switch (action) {
        case "create":
          try {
            // Buat Data Baru
            result = await prisma.resep.create({
              data: {
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
          } catch (error) {
            if (error.code === "P2002") {
              // Prisma error code for unique constraint violation
              return res.status(400).json({
                success: false,
                message: "Resep dengan id_rekam_medis ini sudah ada.",
              });
            }
            console.error("Create Resep failed:", error);
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }
          break;

        case "read":
          console.log("Read operation");
          result = await prisma.resep.findMany({
            orderBy: {
              id_resep: "asc",
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          });
          console.log("Read Resep successful:", result);
          break;

        case "update":
          console.log("Update operation");

          const {
            id_resep: idResepToUpdate,
            id_rekam_medis: idRekamMedisToUpdate,
            id_obat: idObatToUpdate,
            jumlah_obat,
          } = data; // Extract ids and update data

          // Prepare the // Prepare the update payload
          const updatePayloadResep = {
            where: { id_resep: idResepToUpdate },
            data: {
              id_rekam_medis: idRekamMedisToUpdate,
              id_obat: idObatToUpdate,
              jumlah_obat: jumlah_obat,
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          };

          try {
            // Execute the update operation
            result = await prisma.resep.update(updatePayloadResep);
            console.log("Update Resep successful:", result);
          } catch (error) {
            // Handle any errors during the update operation
            console.error("Update Resep failed:", error);
            throw new Error("Failed to update resep");
          }
          break;

        case "delete":
          console.log("Delete operation");
          result = await prisma.resep.delete({
            where: { id_resep: data.id_resep },
          });
          console.log("Delete Resep successful:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      console.error("Operation failed:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      console.log("Received action:", action); // Log action
      let result;

      switch (action) {
        case "read":
          result = await prisma.resep.findMany({
            orderBy: {
              id_resep: "asc",
            },
            where: {
              id_pemilik: data.id_pemilik,
            },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default resepController;
