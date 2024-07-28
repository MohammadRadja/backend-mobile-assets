import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
const prisma = new PrismaClient();
const uploads = multer({ dest: "BuktiPembayaran/" });

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
const pembayaranController = {
  // Admin: CRUD semua tabel
  adminCRUDPembayaran: async (req, res) => {
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
          const file = req.file;
          const buktiBayarPath = file
            ? `/BuktiPembayaran/${file.filename}`
            : null;
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
          try {
            console.log("Fetching data pembayaran...");

            // Ambil data pembayaran
            const result = await prisma.pembayaran.findMany({
              orderBy: {
                id_pembayaran: "asc",
              },
              select: {
                id_pembayaran: true,
                id_rekam_medis: true,
                rekam_medis: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    keluhan: true,
                  },
                },
                id_pemilik: true,
                pemilik: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    username: true,
                  },
                },
                id_hewan: true,
                hewan: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_hewan: true,
                  },
                },
                id_dokter: true,
                dokter: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_dokter: true,
                  },
                },
                id_appointment: true,
                appointment: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    catatan: true,
                  },
                },
                id_obat: true,
                obat: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_obat: true,
                  },
                },
                id_resep: true,
                resep: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    jumlah_obat: true,
                  },
                },
                tgl_pembayaran: true,
                jumlah_pembayaran: true,
                bukti_pembayaran: true,
              },
            });

            console.log("Raw Data Pembayaran:", result);

            // Format data pembayaran
            const formattedResult = result.map((pembayaran) => ({
              ...pembayaran,
              tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
              jumlah_pembayaran: pembayaran.jumlah_pembayaran.toString(),
            }));

            // Kirim respons
            return res.json({ success: "read", data: formattedResult });

            console.log("Formatted Data Pembayaran:", formattedResult);
          } catch (error) {
            console.error("Error fetching data pembayaran:", error);
            // Kirim respons error
            return res.status(500).json({
              success: "error",
              message: "Error fetching data pembayaran",
            });
          }
          break;

        case "update":
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Pembayaran" });
          }
          const updatedFile = req.file;
          const updatedBuktiBayarPath = updatedFile
            ? `/BuktiPembayaran/${updatedFile.filename}`
            : null;
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran },
            data: {
              id_rekam_medis: parseInt(data.id_rekam_medis, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              id_appointment: parseInt(data.id_appointment, 10),
              id_obat: parseInt(data.id_obat, 10),
              id_resep: parseInt(data.id_resep, 10),
              tgl_pembayaran: parseDate(data.tgl_pembayaran),
              jumlah_pembayaran: parseInt(data.jumlah_pembayaran, 10),
              bukti_bayar: updatedBuktiBayarPath,
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
            where: { id_pembayaran: data.id_pembayaran },
          });
          return res.json({
            success: true,
            message: "Pembayaran deleted successfully",
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
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          const file = req.file;
          const buktiBayarPath = file
            ? `/BuktiPembayaran/${file.filename}`
            : null;
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
          try {
            console.log("Fetching data pembayaran...");

            // Ambil data pembayaran
            const result = await prisma.pembayaran.findMany({
              orderBy: {
                id_pembayaran: "asc",
              },
              select: {
                id_pembayaran: true,
                id_rekam_medis: true,
                rekam_medis: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    keluhan: true,
                  },
                },
                id_pemilik: true,
                pemilik: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    username: true,
                  },
                },
                id_hewan: true,
                hewan: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_hewan: true,
                  },
                },
                id_dokter: true,
                dokter: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_dokter: true,
                  },
                },
                id_appointment: true,
                appointment: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    catatan: true,
                  },
                },
                id_obat: true,
                obat: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    nama_obat: true,
                  },
                },
                id_resep: true,
                resep: {
                  // Sesuaikan dengan nama relasi di skema
                  select: {
                    jumlah_obat: true,
                  },
                },
                tgl_pembayaran: true,
                jumlah_pembayaran: true,
                bukti_pembayaran: true,
              },
            });

            console.log("Raw Data Pembayaran:", result);

            // Format data pembayaran
            const formattedResult = result.map((pembayaran) => ({
              ...pembayaran,
              tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
              jumlah_pembayaran: pembayaran.jumlah_pembayaran.toString(),
            }));

            // Kirim respons
            return res.json({ success: "read", data: formattedResult });

            console.log("Formatted Data Pembayaran:", formattedResult);
          } catch (error) {
            console.error("Error fetching data pembayaran:", error);
            // Kirim respons error
            return res.status(500).json({
              success: "error",
              message: "Error fetching data pembayaran",
            });
          }
          break;

        case "update":
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Pembayaran" });
          }
          const updatedFile = req.file;
          const updatedBuktiBayarPath = updatedFile
            ? `/BuktiPembayaran/${updatedFile.filename}`
            : null;
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran },
            data: {
              id_rekam_medis: parseInt(data.id_rekam_medis, 10),
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              id_appointment: parseInt(data.id_appointment, 10),
              id_obat: parseInt(data.id_obat, 10),
              id_resep: parseInt(data.id_resep, 10),
              tgl_pembayaran: parseDate(data.tgl_pembayaran),
              jumlah_pembayaran: parseInt(data.jumlah_pembayaran, 10),
              bukti_bayar: updatedBuktiBayarPath,
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
            where: { id_pembayaran: data.id_pembayaran },
          });
          return res.json({
            success: true,
            message: "Pembayaran deleted successfully",
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
      if (user.role !== "pemilik") {
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
          result = await prisma.pembayaran.findMany({
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
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default pembayaranController;
