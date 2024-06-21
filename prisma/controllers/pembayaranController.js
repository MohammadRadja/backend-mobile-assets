import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pembayaranController = {
  // Admin: CRUD semua tabel
  adminCRUDPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { jabatan_admin } = req;
      if (jabatan_admin !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.pembayaran.create({
            data: {
              tgl_pembayaran: data.tgl_pembayaran,
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });
          break;
        case "read":
          result = await prisma.pembayaran.findMany();
          break;
        case "update":
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.pembayaran.delete({
            where: { id_pembayaran: data.id_pembayaran },
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

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { jabatan_pegawai } = req;
      if (jabatan_pegawai !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.pembayaran.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              tgl_pembayaran: data.tgl_pembayaran,
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });
          break;
        case "read":
          result = await prisma.pembayaran.findMany();
          break;
        case "update":
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.pembayaran.delete({
            where: { id_pembayaran: data.id_pembayaran },
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

  // Pemilik: Hanya dapat melihat data
  pemilikReadPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { jabatan_pemilik } = req;
      if (jabatan_pemilik !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.pembayaran.findMany();
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

export default pembayaranController;
