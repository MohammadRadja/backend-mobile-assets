import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  // Admin: CRUD semua tabel
  adminCRUDHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { tableName } = req;
      console.log("Table Name:", tableName);
      if (tableName !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action);
      console.log("Data:", data);

      let result;
      switch (action) {
        case "create":
          // Validasi input data
          if (
            !data.id_pemilik ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            console.log("Missing required fields:", data);
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Proses pembuatan data baru
          result = await prisma.hewan.create({
            data: {
              id_pemilik: data.id_pemilik,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
          });
          console.log("Create Result:", result);
          break;
        case "read":
          result = await prisma.hewan.findMany();
          console.log("Read Result:", result);
          break;
        case "update":
          result = await prisma.hewan.update({
            where: { id_hewan: data.id_hewan },
            data: { ...data },
          });
          console.log("Update Result:", result);
          break;
        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          console.log("Delete Result:", result);
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in adminCRUDHewan:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDHewan: async (req, res) => {
    try {
      const { tableName } = req;
      if (tableName !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          // Validasi input data
          if (
            !data.id_pemilik ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Proses pembuatan data baru
          result = await prisma.hewan.create({
            data: {
              id_pemilik: data.id_pemilik,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
          });
          break;
        case "read":
          result = await prisma.hewan.findMany();
          break;
        case "update":
          result = await prisma.hewan.update({
            where: { id_hewan: data.id_hewan },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { tableName } = req;
      if (tableName !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.hewan.findMany();
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default hewanController;
