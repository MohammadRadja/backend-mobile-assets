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

      const { action } = req.body; // Mengambil action dari body
      console.log("Action read detail request:", action);

      let result;
      switch (action) {
        case "read":
          try {
            // Mengambil data detail request
            result = await prisma.detailRequest.findMany({
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
          } catch (error) {
            console.error("Error reading detail request:", error);
            throw error;
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Admin Read Detail Request:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil detail request untuk pengguna dengan jabatan petugas.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  petugasReadDetailRequest: async (req, res) => {
    try {
      const { user } = req;
      // Memastikan pengguna adalah petugas
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      console.log("Action CRUD Rekam Medis:", action);

      let result;
      switch (action) {
        case "read":
          try {
            // Mengambil data detail request
            result = await prisma.detailRequest.findMany({
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
          } catch (error) {
            console.error("Error reading detail request:", error);
            throw error;
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error Petugas in Read Detail Request:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengambil detail request untuk pengguna dengan jabatan pegawai.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  pegawaiReadDetailRequest: async (req, res) => {
    try {
      const { user } = req;
      // Memastikan pengguna adalah pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPegawai = user.id_user || ""; // Mengambil id_user pegawai
      const { action } = req.body;
      console.log("Action:", action);

      let result;
      switch (action) {
        case "read":
          try {
            // Mengambil data detail request untuk pegawai tertentu
            result = await prisma.detailRequest.findMany({
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
          } catch (error) {
            console.error("Error reading detail request:", error);
            throw error;
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error Pegawai in Read Detail Request:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default detailRequestController;
