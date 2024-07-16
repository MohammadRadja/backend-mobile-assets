import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const dataPemilikController = {
  adminCRUDDataPemilik: async (req, res) => {
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
          const existUsername = await prisma.pemilik.findFirst({
            where: {
              username: data.username,
            },
          });
          if (existUsername) {
            res.status(400).json({
              success: false,
              message: "Username Pemilik already exist",
            });
            return;
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.pemilik.create({
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
          result = await prisma.pemilik.findMany();
          break;

        case "update":
          result = await prisma.pemilik.update({
            where: { id_pemilik: data.id_pemilik },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.pemilik.delete({
            where: { id_pemilik: data.id_pemilik },
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
  pegawaiCRUDDataPemilik: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.role !== "pegawai") {
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
          const existUsername = await prisma.pemilik.findFirst({
            where: {
              username: data.username,
            },
          });
          if (existUsername) {
            res.status(400).json({
              success: false,
              message: "Username Pemilik already exist",
            });
            return;
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.pemilik.create({
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
          result = await prisma.pemilik.findMany();
          break;

        case "update":
          result = await prisma.pemilik.update({
            where: { id_pemilik: data.id_pemilik },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.pemilik.delete({
            where: { id_pemilik: data.id_pemilik },
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

  // Pemilik hanya dapat melihat data
  pemilikCRUDDataPemilik: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.role !== "pemilik") {
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
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "read":
          result = await prisma.pemilik.findMany({
            where: { id_pemilik: data.id_pemilik },
          });
          if (!result) {
            console.log("Pemilik not found for ID:", idPegawai);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik not found." });
          }
          break;

        case "update":
          console.log("Updating data for pemilik ID:", idPegawai);
          if (!data) {
            console.log("Missing data in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data pemilik tidak lengkap." });
          }

          // Hapus id_pegawai dari data yang akan diupdate
          const { id_pemilik, password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          result = await prisma.pemilik.update({
            where: { id_pemilik: idPegawai }, // Gunakan id dari parameter URL
            data: { ...updateData }, // Kirim data tanpa id_pegawai
          });
          console.log("Update successful:", result);
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
};

export default dataPemilikController;
