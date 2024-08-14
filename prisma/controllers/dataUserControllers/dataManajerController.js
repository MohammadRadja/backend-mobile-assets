import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola data Manajer
 */
const dataManajerController = {
  /**
   * Manajer: Melakukan operasi CRUD pada data Manajer
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  ManajerCRUDDataManajer: async (req, res) => {
    try {
      const { user } = req;

      // Pastikan user memiliki peran manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const idManager = user.id_user;
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "read":
          console.log("GET ID Manager:", idManager);
          result = await prisma.user.findUnique({
            where: { id_user: idManager },
          });
          if (!result) {
            console.log("ID Manager tidak ditemukan:", idManager);
            return res
              .status(404)
              .json({ success: false, message: "Manager tidak ditemukan." });
          }
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

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Manajer - Response status: 500");
      console.error("CRUD Manajer - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Petugas: Melihat data Manajer
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  petugasReadDataManajer: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah petugas
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      // Mengambil data manajer
      const result = await prisma.user.findMany({
        where: { jabatan: "manajer" },
        orderBy: { id_user: "asc" }, // Mengurutkan berdasarkan id_user
      });

      console.log("Data Manajer:", result);

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Petugas Read Data Manajer:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai: Melihat data Manajer
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  pegawaiReadDataManajer: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      // Mengambil data manajer
      const result = await prisma.user.findMany({
        where: { jabatan: "manajer" },
        orderBy: { id_user: "asc" }, // Mengurutkan berdasarkan id_user
      });

      console.log("Data Manajer:", result);

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in Pegawai Read Data Manajer:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataManajerController;
