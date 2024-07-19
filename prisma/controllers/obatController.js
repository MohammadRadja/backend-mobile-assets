import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const obatController = {
  adminCRUDObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "create":
          result = await prisma.obat.create({
            data: {
              nama_obat: data.nama_obat,
              keterangan: data.keterangan,
            },
          });
          break;

        case "read":
          result = await prisma.obat.findMany();
          break;

        case "update":
          result = await prisma.obat.update({
            where: { id_obat: data.id_obat },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.obat.delete({
            where: { id_obat: data.id_obat },
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

  // Pegawai dapat CRUD semua data kecuali tabel admin
  pegawaiCRUDObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "create":
          result = await prisma.obat.create({
            data: {
              nama_obat: data.nama_obat,
              keterangan: data.keterangan,
            },
          });
          break;

        case "read":
          result = await prisma.obat.findMany();
          break;

        case "update":
          result = await prisma.obat.update({
            where: { id_obat: data.id_obat },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.obat.delete({
            where: { id_obat: data.id_obat },
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

  // Pemilik hanya dapat melihat data
  pemilikReadObat: async (req, res) => {
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
          result = await prisma.obat.findUnique({
            where: { id_pemilik: data.id_pemilik },
          });
          if (!result) {
            console.log("Pemilik not found for ID:", id_pemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik not found." });
          }
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

export default obatController;
