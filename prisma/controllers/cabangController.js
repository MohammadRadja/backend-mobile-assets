import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola data Cabang
 */
const cabangController = {
  /**
   * Manajer: Melakukan operasi CRUD pada data Cabang
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  manajerCRUDCabang: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "create":
          // Validasi data input
          if (
            !data.nama_cabang == null ||
            !data.alamat_cabang == null ||
            !data.notelp_cabang == null ||
            data.keterangan == null
          ) {
            return res.status(400).json({
              success: false,
              message: "Input Data Cabang tidak boleh kosong",
            });
          }

          // Cek apakah nama cabang sudah ada
          const existingCabang = await prisma.cabang.findFirst({
            where: { nama_cabang: data.nama_cabang },
          });

          if (existingCabang) {
            return res
              .status(400)
              .json({ success: false, message: "Nama Cabang sudah ada" });
          }

          // Proses pembuatan data Cabang baru
          result = await prisma.cabang.create({
            data: {
              nama_cabang: data.nama_cabang,
              alamat_cabang: data.alamat_cabang,
              notelp_cabang: data.notelp_cabang,
              keterangan: data.keterangan,
            },
          });
          return res.status(200).json({
            success: true,
            message: "Cabang berhasil dibuat",
            data: result,
          });

        case "read":
          // Mengambil semua data Cabang
          result = await prisma.cabang.findMany({
            orderBy: { kode_cabang: "asc" },
          });
          return res.status(200).json({
            success: true,
            message: "Data cabang berhasil diambil",
            data: result,
          });

        case "update":
          // Memperbarui data Cabang yang ada
          result = await prisma.cabang.update({
            where: { kode_cabang: data.kode_cabang },
            data: { ...data },
          });
          return res.status(200).json({
            success: true,
            message: "Data Cabang berhasil diupdate",
            data: result,
          });

        case "delete":
          // Menghapus data Cabang berdasarkan ID
          result = await prisma.cabang.delete({
            where: { kode_cabang: data.kode_cabang },
          });
          return res.status(200).json({
            success: true,
            message: "Data Cabang berhasil dihapus",
            data: result,
          });

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
    } catch (error) {
      console.error("Error dalam manajerCRUDCabang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Petugas: Melakukan operasi CRUD pada data Cabang, kecuali admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  petugasCRUDCabang: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran petugas
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "create":
          // Proses pembuatan data Cabang baru
          result = await prisma.cabang.create({
            data: {
              nama_cabang: data.nama_cabang,
              alamat_cabang: data.alamat_cabang,
              notelp_cabang: data.notelp_cabang,
              keterangan: data.keterangan,
            },
          });
          return res.status(200).json({
            success: true,
            message: "Cabang berhasil dibuat",
            data: result,
          });

        case "read":
          // Mengambil semua data Cabang
          result = await prisma.cabang.findMany({
            orderBy: { id_cabang: "asc" },
          });
          return res.status(200).json({
            success: true,
            message: "Data cabang berhasil diambil",
            data: result,
          });

        case "update":
          // Memperbarui data Cabang yang ada
          result = await prisma.cabang.update({
            where: { id_cabang: data.id_cabang },
            data: { ...data },
          });
          return res.status(200).json({
            success: true,
            message: "Cabang berhasil diupdate",
            data: result,
          });

        case "delete":
          // Menghapus data Cabang berdasarkan ID
          result = await prisma.cabang.delete({
            where: { id_cabang: data.id_cabang },
          });
          return res.status(200).json({
            success: true,
            message: "Cabang berhasil dihapus",
            data: result,
          });

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
    } catch (error) {
      console.error("Error dalam petugasCRUDCabang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai: Hanya dapat melihat data cabang
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  pegawaiReadCabang: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action } = req.body;

      if (action !== "read") {
        return res
          .status(400)
          .json({ success: false, message: "Aksi tidak valid" });
      }

      // Mengambil semua data Cabang
      const result = await prisma.cabang.findMany({
        orderBy: { kode_cabang: "asc" },
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error dalam pegawaiReadCabang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default cabangController;
