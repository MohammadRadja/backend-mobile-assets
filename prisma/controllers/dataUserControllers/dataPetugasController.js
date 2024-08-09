import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

/**
 * Controller untuk mengelola data petugas.
 */
const dataPetugasController = {
  /**
   * Fungsi untuk CRUD data petugas oleh manajer.
   * @param {Object} req - Request dari klien.
   * @param {Object} res - Response untuk klien.
   */
  manajerCRUDDataPetugas: async (req, res) => {
    try {
      const { user } = req;

      // Cek apakah user adalah manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log action yang diterima
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      // Menentukan tindakan berdasarkan action yang diterima
      switch (action) {
        case "create":
          // Cek apakah username sudah ada
          const existUsername = await prisma.user.findFirst({
            where: {
              username: data.username,
            },
          });
          if (existUsername) {
            return res.status(400).json({
              success: false,
              message: "Username Petugas sudah ada",
            });
          }

          // Hash password sebelum menyimpan ke database
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.user.create({
            data: {
              username: data.username,
              password: hash,
              jabatan: "petugas",
            },
          });
          break;

        case "read":
          // Mengambil semua data petugas
          result = await prisma.user.findMany({
            where: { jabatan: "petugas" },
            orderBy: { id_user: "asc" },
            select: {
              id_user: true,
              username: true,
              password: false,
              jabatan: true,
            },
          });
          console.log("Data Petugas:", result);
          break;

        case "update":
          let updateData = { ...data };
          if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            updateData.password = hash; // Mengupdate password yang sudah dihash
          }

          result = await prisma.user.update({
            where: { id_user: data.id_user },
            data: updateData,
          });
          break;

        case "delete":
          // Cek apakah petugas dengan ID yang diberikan ada
          const userToDelete = await prisma.user.findUnique({
            where: { id_user: data.id_user },
          });

          if (!userToDelete) {
            return res.status(404).json({
              success: false,
              message: "Petugas tidak ditemukan",
            });
          }

          // Hapus data petugas
          result = await prisma.user.delete({
            where: { id_user: data.id_user },
          });
          console.log("Delete Petugas - Response status: 200");
          console.log("Delete Petugas - Response body:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Petugas dari Manajer - Response status: 500");
      console.error(
        "CRUD Petugas dari Manajer - Response body:",
        error.message
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Fungsi untuk CRUD data petugas oleh petugas.
   * @param {Object} req - Request dari klien.
   * @param {Object} res - Response untuk klien.
   */
  petugasCRUDDataPetugas: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const idPetugas = user.id_user || "";
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      // Menentukan tindakan berdasarkan action yang diterima
      switch (action) {
        case "read":
          console.log("GET ID Petugas:", idPetugas);
          result = await prisma.user.findUnique({
            where: { id_user: idPetugas },
          });
          if (!result) {
            console.log("ID Petugas tidak ditemukan:", idPetugas);
            return res
              .status(404)
              .json({ success: false, message: "Petugas tidak ditemukan." });
          }
          break;

        case "update":
          console.log("Updating data untuk petugas ID:", idPetugas);
          if (!data) {
            console.log("Data yang akan diperbarui tidak lengkap:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data petugas tidak lengkap." });
          }

          console.log("Data sebelum update:", data);
          const { password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          try {
            // Update data petugas
            result = await prisma.user.update({
              where: { id_user: idPetugas },
              data: { ...updateData },
            });
            console.log("Update berhasil:", result);
          } catch (updateError) {
            return res
              .status(500)
              .json({ success: false, message: "Update gagal." });
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Petugas dari Admin - Response status: 500");
      console.error("CRUD Petugas dari Admin - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Fungsi untuk membaca data petugas oleh pegawai.
   * @param {Object} req - Request dari klien.
   * @param {Object} res - Response untuk klien.
   */
  pegawaiReadDataPetugas: async (req, res) => {
    try {
      const { user } = req;
      console.log("User:", user);
      console.log("Jabatan user:", user.jabatan);
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }
      // Mengambil data manajer
      const result = await prisma.user.findMany({
        where: { jabatan: "petugas" },
        orderBy: { id_user: "asc" }, // Mengurutkan berdasarkan id_user
        select: {
          id_user: true,
          username: true,
          password: false,
          jabatan: true,
        },
      });

      console.log("Data Petugas:", result);

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Pegawai Read Data Petugas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPetugasController;
