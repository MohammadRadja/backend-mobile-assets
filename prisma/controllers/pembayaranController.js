import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

const pembayaranController = {
  // Admin: CRUD semua tabel
  adminCRUDPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;
      // const to parse DD-MM-YYYY date to ISO-8601 format
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format: ${dateStr}`);
        }
        console.log(`Parsed date from "${dateStr}" to "${date.toISOString()}"`);
        return date.toISOString(); // Corrected line
      };
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      switch (action) {
        case "create":
          const file = req.file;
          const buktiBayarPath = file ? `/uploads/${file.filename}` : null;
          result = await prisma.pembayaran.create({
            data: {
              id_rekam_medis: parseInt(data.id_rekam_medis, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              id_appointment: parseInt(data.id_appointment, 10),
              id_obat: parseInt(data.id_obat, 10),
              id_resep: parseInt(data.id_resep, 10),
              tgl_pembayaran: parseDate(data.tgl_pembayaran),
              jumlah_pembayaran: data.jumlah_pembayaran,
              bukti_bayar: buktiBayarPath,
            },
          });
          break;
        case "read":
          result = await prisma.pembayaran.findMany({
            select: {
              id_pembayaran: true,
              id_rekam_medis: true,
              rekamMedis: {
                select: {
                  keluhan: true,
                },
              },
              id_pemilik: true,
              pemilik: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              id_appointment: true,
              appointment: {
                select: {
                  catatan: true,
                },
              },
              id_obat: true,
              obat: {
                select: {
                  nama_obat: true,
                },
              },
              id_resep: true,
              resep: {
                select: {
                  jumlah_obat: true,
                },
              },
              tgl_pembayaran: true,
              jumlah_pembayaran: true,
              bukti_pembayaran: true,
            },
          });

          result = result.map((pembayaran) => ({
            ...pembayaran,
            tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
          }));
          console.log("Data Pembayaran:", result);
          break;

        case "update":
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Pembayaran" });
          }
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: parseInt(data.id_pembayaran, 10) }, // Ensure the id is an integer
            data: {
              id_rekam_medis: parseInt(data.id_rekam_medis, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              id_appointment: parseInt(data.id_appointment, 10),
              id_obat: parseInt(data.id_obat, 10),
              id_resep: parseInt(data.id_resep, 10),
              tgl_pembayaran: parseDate(data.tgl_pembayaran),
              jumlah_pembayaran: data.jumlah_pembayaran,
              bukti_bayar: buktiBayarPath,
            },
          });
          break;

        case "delete":
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Pembayaran" });
          }
          result = await prisma.pembayaran.delete({
            where: { id_rekam_medis: parseInt(data.id_rekam_medis, 10) },
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
      const { user } = req;
      if (user !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          const file = req.file;
          const buktiBayarPath = file ? `/uploads/${file.filename}` : null;
          result = await prisma.pembayaran.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              tgl_pembayaran: data.tgl_pembayaran,
              jumlah_pembayaran: data.jumlah_pembayaran,
              bukti_bayar: buktiBayarPath,
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
      const { user } = req;
      if (user !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          const file = req.file;
          const buktiBayarPath = file ? `/uploads/${file.filename}` : null;
          result = await prisma.pembayaran.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              tgl_pembayaran: data.tgl_pembayaran,
              jumlah_pembayaran: data.jumlah_pembayaran,
              bukti_bayar: buktiBayarPath,
            },
          });
          break;
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
