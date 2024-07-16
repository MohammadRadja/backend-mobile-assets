import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const dataPegawaiController = {
  adminCRUDDataPegawai: async (req, res) => {
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
          const existUsername = await prisma.pegawai.findFirst({
            where: {
              username: data.username,
            },
          });
          if (existUsername) {
            res.status(400).json({
              success: false,
              message: "Username Pegawai already exist",
            });
            return;
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.pegawai.create({
            data: {
              username: data.username,
              password: hash,
              jabatan: data.jabatan,
              alamat: data.alamat,
              no_telp: data.no_telp,
            },
          });
          break;

        case "read":
          result = await prisma.pegawai.findMany();
          break;

        case "update":
          result = await prisma.pegawai.update({
            where: { id_pegawai: data.id_pegawai },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.pegawai.delete({
            where: { id_pegawai: data.id_pegawai },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai dapat CRUD semua data kecuali tabel admin
  pegawaiCRUDDataPegawai: async (req, res) => {
    console.log("Request received:", req.method, req.path);
    try {
      const { user } = req;
      console.log("User role:", user.role);
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPegawai = parseInt(req.params.id, 10); // Konversi ke integer
      if (isNaN(idPegawai)) {
        console.log("Invalid id_pegawai provided:", req.params.id);
        return res
          .status(400)
          .json({ success: false, message: "ID pegawai tidak valid." });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "read":
          console.log("Fetching data for pegawai ID:", idPegawai);
          result = await prisma.pegawai.findUnique({
            where: { id_pegawai: idPegawai },
          });
          if (!result) {
            console.log("Pegawai not found for ID:", idPegawai);
            return res
              .status(404)
              .json({ success: false, message: "Pegawai not found." });
          }
          break;

        case "update":
          console.log("Updating data for pegawai ID:", idPegawai);
          if (!data) {
            console.log("Missing data in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data pegawai tidak lengkap." });
          }

          // Hapus id_pegawai dari data yang akan diupdate
          const { id_pegawai, password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          result = await prisma.pegawai.update({
            where: { id_pegawai: idPegawai }, // Gunakan id dari parameter URL
            data: { ...updateData }, // Kirim data tanpa id_pegawai
          });
          console.log("Update successful:", result);
          break;

        default:
          console.log("Invalid action received:", action);
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPegawaiController;
