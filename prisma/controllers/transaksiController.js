import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fungsi untuk mengubah format tanggal dari string ke ISO-8601.
 * @param {string} dateStr - Tanggal dalam format string.
 * @returns {string} Tanggal dalam format ISO-8601.
 * @throws {Error} Jika format tanggal tidak valid.
 */
const parseDate = (dateStr) => {
  // Jika sudah dalam format ISO-8601, langsung kembalikan
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Format tanggal tidak valid: ${dateStr}`);
    }
    return date.toISOString();
  }

  // Jika dalam format DD-MM-YYYY, lakukan konversi
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Format tanggal tidak valid: ${dateStr}`);
  }
  date.setUTCHours(0, 0, 0, 0); // Mengatur waktu ke 00:00:00 UTC
  return date.toISOString();
};

/**
 * Fungsi untuk memformat tanggal ke DD-MM-YYYY.
 * @param {Date} date - Tanggal dalam objek Date.
 * @returns {string} Tanggal dalam format DD-MM-YYYY.
 */
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const transaksiController = {
  /**
   * Fungsi untuk mengelola pembacaan transaksi oleh manajer.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  manajerReadTransaksi: async (req, res) => {
    try {
      const { user } = req;

      // Memeriksa apakah pengguna adalah manajer
      if (user.jabatan !== "manajer") {
        console.warn("Akses ditolak: Pengguna bukan manajer.");
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action } = req.body;
      console.log("Action diterima:", action); // Log action yang diterima

      let result;

      switch (action) {
        case "read":
          // Membaca data dari view Transaksi
          result = await prisma.transaksi.findMany({
            orderBy: {
              tanggal_request: "asc",
            },
            select: {
              kode_request: true,
              tanggal_request: true,
              nama_cabang: true,
              total_request: true,
            },
          });

          result = result.map((transaksi) => ({
            ...transaksi,
            tanggal_request: formatDate(new Date(transaksi.tanggal_request)),
          }));
          console.log("Data Transaksi:", result);
          break;

        default:
          console.warn("Aksi tidak valid diterima:", action);
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      console.info("Transaksi berhasil dibaca oleh manajer.");
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di manajerReadTransaksi:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Fungsi untuk mengelola pembacaan transaksi oleh petugas.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  petugasReadTransaksi: async (req, res) => {
    try {
      const { user } = req;

      // Memeriksa apakah pengguna adalah petugas
      if (user.jabatan !== "petugas") {
        console.warn("Akses ditolak: Pengguna bukan petugas.");
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak sah" });
      }

      const { action } = req.body;
      console.log("Action diterima:", action); // Log action yang diterima

      let result;

      switch (action) {
        case "read":
          // Membaca data dari view Transaksi
          result = await prisma.transaksi.findMany({
            orderBy: {
              tanggal_request: "asc",
            },
            select: {
              kode_request: true,
              tanggal_request: true,
              nama_cabang: true,
              total_request: true,
            },
          });

          result = result.map((transaksi) => ({
            ...transaksi,
            tanggal_request: formatDate(new Date(transaksi.tanggal_request)),
          }));
          console.log("Data Transaksi:", result);
          break;

        default:
          console.warn("Aksi tidak valid diterima:", action);
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      console.info("Transaksi berhasil dibaca oleh petugas.");
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di petugasReadTransaksi:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default transaksiController;
