import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola data detail request.
 */
const detailRequestController = {
  /**
   * Mengambil detail request untuk pengguna dengan jabatan manajer.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  manajerReadDetailRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Mengambil data detail request
      const result = await prisma.detailRequest.findMany({
        orderBy: {
          kode_request: "asc", // Mengurutkan berdasarkan kode_request
        },
        select: {
          kode_request: true,
          id_user: true,
          id_barang: true,
          status: true,
          qty_request: true,
          subtotal: true,
        },
      });

      console.log("Data Detail Request:", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Manajer Read Detail Request:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil detail request untuk pengguna dengan jabatan pegawai.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  petugasReadDetailRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah pegawai
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Mengambil data detail request
      const result = await prisma.detailRequest.findMany({
        orderBy: {
          kode_request: "asc", // Mengurutkan berdasarkan kode_request
        },
        select: {
          kode_request: true,
          id_user: true,
          id_barang: true,
          status: true,
          qty_request: true,
          subtotal: true,
        },
      });

      console.log("Data Detail Request:", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Pegawai Read Detail Request:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil detail request untuk pengguna dengan jabatan pemilik.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  pegawaiReadDetailRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah pemilik
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPegawai = user.id_user || "";

      // Mengambil data detail request
      const result = await prisma.detailRequest.findMany({
        where: {
          id_user: idPegawai,
        },
        orderBy: {
          kode_request: "asc", // Mengurutkan berdasarkan kode_request
        },
        select: {
          kode_request: true,
          id_user: true,
          id_barang: true,
          status: true,
          qty_request: true,
          subtotal: true,
        },
      });

      console.log("Data Detail Request:", result);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Pemilik Read Detail Request:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default detailRequestController;
