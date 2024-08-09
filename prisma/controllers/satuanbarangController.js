import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Mengelola CRUD operasi untuk data satuan barang.
 */
const satuanBarangController = {
  /**
   * Manajer CRUD Satuan Barang
   * Mengelola operasi CRUD untuk manajer.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi CRUD atau pesan kesalahan.
   */
  manajerCRUDSatuanBarang: async (req, res) => {
    try {
      // Pastikan user memiliki peran manajer
      const { user } = req;
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          // Validasi input
          if (!data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "Nama satuan tidak boleh kosong",
            });
          }
          result = await prisma.satuan_barang.create({
            data: {
              nama_satuan: data.nama_satuan,
            },
          });
          break;

        case "read":
          result = await prisma.satuan_barang.findMany();
          break;

        case "update":
          if (!data.id_satuan || !data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "ID satuan dan nama satuan harus disediakan",
            });
          }
          result = await prisma.satuan_barang.update({
            where: { id_satuan: data.id_satuan },
            data: { nama_satuan: data.nama_satuan },
          });
          break;

        case "delete":
          if (!data.id_satuan) {
            return res
              .status(400)
              .json({ success: false, message: "ID satuan harus disediakan" });
          }
          result = await prisma.satuan_barang.delete({
            where: { id_satuan: data.id_satuan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di manajerCRUDSatuanBarang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Petugas CRUD Satuan Barang
   * Mengelola operasi CRUD untuk petugas.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi CRUD atau pesan kesalahan.
   */
  petugasCRUDSatuanBarang: async (req, res) => {
    try {
      // Pastikan user memiliki peran petugas
      const { user } = req;
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          // Validasi input
          if (!data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "Nama satuan tidak boleh kosong",
            });
          }
          result = await prisma.satuan_barang.create({
            data: {
              nama_satuan: data.nama_satuan,
            },
          });
          break;

        case "read":
          result = await prisma.satuan_barang.findMany();
          break;

        case "update":
          if (!data.id_satuan || !data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "ID satuan dan nama satuan harus disediakan",
            });
          }
          result = await prisma.satuan_barang.update({
            where: { id_satuan: data.id_satuan },
            data: { nama_satuan: data.nama_satuan },
          });
          break;

        case "delete":
          if (!data.id_satuan) {
            return res
              .status(400)
              .json({ success: false, message: "ID satuan harus disediakan" });
          }
          result = await prisma.satuan_barang.delete({
            where: { id_satuan: data.id_satuan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di petugasCRUDSatuanBarang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai Read Satuan Barang
   * Mengelola operasi baca untuk pegawai.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi baca atau pesan kesalahan.
   */
  pegawaiCRUDSatuanBarang: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      console.log("Received action:", action); // Log action
      let result;

      switch (action) {
        case "create":
          // Validasi input
          if (!data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "Nama satuan tidak boleh kosong",
            });
          }
          result = await prisma.satuan_barang.create({
            data: {
              nama_satuan: data.nama_satuan,
            },
          });
          break;

        case "read":
          result = await prisma.satuan_barang.findMany();
          break;

        case "update":
          if (!data.id_satuan || !data.nama_satuan) {
            return res.status(400).json({
              success: false,
              message: "ID satuan dan nama satuan harus disediakan",
            });
          }
          result = await prisma.satuan_barang.update({
            where: { id_satuan: data.id_satuan },
            data: { nama_satuan: data.nama_satuan },
          });
          break;

        case "delete":
          if (!data.id_satuan) {
            return res
              .status(400)
              .json({ success: false, message: "ID satuan harus disediakan" });
          }
          result = await prisma.satuan_barang.delete({
            where: { id_satuan: data.id_satuan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di pegawaiReadSatuanBarang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default satuanBarangController;
