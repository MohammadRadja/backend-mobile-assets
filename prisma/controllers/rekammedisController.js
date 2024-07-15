import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rekammedisController = {
  adminCRUDRekamMedis: async (req, res) => {
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
      console.log("Data diterima:", data);
      let result;

      // Function to parse DD-MM-YYYY date to ISO-8601 format
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
      };

      switch (action) {
        case "create":
          // Validasi bahwa tgl_periksa ada dalam data yang diterima
          result = await prisma.rekamMedis.create({
            data: {
              id_hewan: parseInt(data.id_hewan, 10), // Konversi ke integer
              id_pemilik: parseInt(data.id_pemilik, 10), // Konversi ke integer
              id_pegawai: parseInt(data.id_pegawai, 10), // Konversi ke integer
              id_obat: parseInt(data.id_obat, 10), // Konversi ke integer
              keluhan: data.keluhan,
              diagnosa: data.diagnosa,
              tgl_periksa: parseDate(data.tgl_periksa), // Konversi tgl_periksa
            },
          });
          break;

        case "read":
          result = await prisma.rekamMedis.findMany({
            select: {
              id_rekam_medis: true,
              id_hewan: true,
              id_pemilik: true,
              id_pegawai: true,
              id_obat: true,
              keluhan: true,
              diagnosa: true,
              tgl_periksa: true, // Sertakan tgl_periksa dalam hasil query
            },
          });
          console.log("Data Rekam Medis:", result);
          break;

        case "update":
          result = await prisma.rekamMedis.update({
            where: { id_rekam_medis: data.id_rekam_medis },
            data: {
              ...data,
              id_hewan: parseInt(data.id_hewan, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_pegawai: parseInt(data.id_pegawai, 10),
              id_obat: parseInt(data.id_obat, 10),
              tgl_periksa: parseDate(data.tgl_periksa), // Konversi tgl_periksa
            },
          });
          break;

        case "delete":
          result = await prisma.rekamMedis.delete({
            where: { id_rekam_medis: data.id_rekam_medis },
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

  pegawaiCRUDRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
      };

      switch (action) {
        case "create":
          if (!data.tgl_periksa) {
            return res
              .status(400)
              .json({ success: false, message: "Missing tgl_periksa" });
          }
          result = await prisma.rekamMedis.create({
            data: {
              id_hewan: parseInt(data.id_hewan, 10), // Konversi ke integer
              id_pemilik: parseInt(data.id_pemilik, 10), // Konversi ke integer
              id_pegawai: parseInt(data.id_pegawai, 10), // Konversi ke integer
              id_obat: parseInt(data.id_obat, 10), // Konversi ke integer
              keluhan: data.keluhan,
              diagnosa: data.diagnosa,
              tgl_periksa: parseDate(data.tgl_periksa), // Konversi tgl_periksa
            },
          });
          break;

        case "read":
          result = await prisma.rekamMedis.findMany();
          break;

        case "update":
          result = await prisma.rekamMedis.update({
            where: { id_rekam_medis: data.id_rekam_medis },
            data: {
              ...data,
              id_hewan: parseInt(data.id_hewan, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_pegawai: parseInt(data.id_pegawai, 10),
              id_obat: parseInt(data.id_obat, 10),
              tgl_periksa: parseDate(data.tgl_periksa), // Konversi tgl_periksa
            },
          });
          break;

        case "delete":
          result = await prisma.rekamMedis.delete({
            where: { id_rekam_medis: data.id_rekam_medis },
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

  pemilikReadRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "read":
          result = await prisma.rekamMedis.findMany();
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

export default rekammedisController;
