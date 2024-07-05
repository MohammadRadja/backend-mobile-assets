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
          result = await prisma.resep.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_obat: data.id_obat,
              jumlah_obat: data.jumlah_obat,
            },
          });
          break;

        case "read":
          console.log("Read operation");
          result = await prisma.resep.findMany({
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
            ...updateDataResep
          } = data; // Extract ids and update data

          const updatePayloadResep = {
            where: { id_resep: idResepToUpdate },
            data: {
              ...updateDataResep,
              rekam_medis: {
                connect: { id_rekam_medis: idRekamMedisToUpdate },
              },
              obat: {
                connect: { id_obat: idObatToUpdate },
              },
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          };

          try {
            result = await prisma.resep.update(updatePayloadResep);
            console.log("Update Resep successful:", result);
          } catch (error) {
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
          result = await prisma.resep.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_obat: data.id_obat,
              jumlah_obat: data.jumlah_obat,
            },
          });
          break;

        case "read":
          console.log("Read operation");
          result = await prisma.resep.findMany({
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
            ...updateDataResep
          } = data; // Extract ids and update data

          const updatePayloadResep = {
            where: { id_resep: idResepToUpdate },
            data: {
              ...updateDataResep,
              rekam_medis: {
                connect: { id_rekam_medis: idRekamMedisToUpdate },
              },
              obat: {
                connect: { id_obat: idObatToUpdate },
              },
            },
            include: {
              rekam_medis: true,
              obat: true,
            },
          };

          try {
            result = await prisma.resep.update(updatePayloadResep);
            console.log("Update Resep successful:", result);
          } catch (error) {
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
          result = await prisma.resep.findMany();
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
