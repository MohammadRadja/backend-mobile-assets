import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  // Admin: CRUD semua tabel
  adminCRUDDokter: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { user } = req;
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      switch (action) {
        case "create":
          // Proses pembuatan data baru
          result = await prisma.doctor.create({
            data: {
              nama_dokter: data.nama_dokter,
              spesialisasi: data.spesialisasi,
            },
          });
          break;

        case "read":
          result = await prisma.doctor.findMany();
          break;

        case "update":
          result = await prisma.doctor.update({
            where: { id_dokter: data.id_dokter },
            data: { ...data }, // Sesuaikan dengan data yang diperlukan
          });
          break;

        case "delete":
          result = await prisma.doctor.delete({
            where: { id_dokter: data.id_dokter },
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

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDDokter: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      switch (action) {
        case "create":
          // Proses pembuatan data baru
          result = await prisma.doctor.create({
            data: {
              nama_dokter: data.nama_dokter,
              spesialisasi: data.spesialisasi,
            },
          });
          break;

        case "read":
          result = await prisma.doctor.findMany();
          break;

        case "update":
          result = await prisma.doctor.update({
            where: { id_dokter: data.id_dokter },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.doctor.delete({
            where: { id_dokter: data.id_dokter },
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
  pemilikReadDokter: async (req, res) => {
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
          result = await prisma.doctor.findMany();
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pemiliReadDoctor:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default hewanController;
