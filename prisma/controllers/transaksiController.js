import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola data detail request.
 */
const transaksiController = {
  /**
   * Mengambil data transaksi untuk pengguna dengan jabatan manajer.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  manajerReadTransaksi: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Mengambil data transaksi
      const result = await prisma.transaksi.findMany({
        orderBy: {
          tanggal_request: "asc", // Mengurutkan berdasarkan tanggal_request
        },
        select: {
          kode_request: true,
          tanggal_request: true,
          nama_cabang: true,
          total_request: true,
        },
      });

      console.log("Data Transaksi (Manajer):", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Manajer Read Transaksi:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil data transaksi untuk pengguna dengan jabatan petugas.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  petugasReadTransaksi: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah petugas
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Mengambil data transaksi
      const result = await prisma.transaksi.findMany({
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

      console.log("Data Transaksi (Petugas):", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Petugas Read Transaksi:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil data transaksi untuk pengguna dengan jabatan pegawai.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  pegawaiReadTransaksi: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Mengambil data transaksi
      const result = await prisma.transaksi.findMany({
        where: {
          // Mungkin ada filter berdasarkan id_user untuk pegawai
          // Misalnya, jika Anda ingin hanya menampilkan transaksi terkait pegawai
          // id_user: user.id_user,
        },
        orderBy: {
          tanggal_request: "asc", // Mengurutkan berdasarkan tanggal_request
        },
        select: {
          kode_request: true,
          tanggal_request: true,
          nama_cabang: true,
          total_request: true,
        },
      });

      console.log("Data Transaksi (Pegawai):", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Pegawai Read Transaksi:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default transaksiController;
