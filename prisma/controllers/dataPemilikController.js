import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

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
          result = await prisma.pemilik.findMany({
            orderBy: {
              id_pemilik: "asc", // Urutkan berdasarkan id_pemilik dalam urutan naik (ascending)
            },
          });
          break;

        case "update":
          result = await prisma.pemilik.update({
            where: { id_pemilik: data.id_pemilik },
            data: { ...data },
          });
          break;

        case "delete":
          result = await prisma.pemilik.deleteMany({
            where: { id_pemilik: data.id_pemilik },
          });
          console.log("Delete Pemilik - Response status: 200");
          console.log("Delete Pemilik - Response body:", result);

          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Delete Pemilik from Admin - Response status: 500");
      console.error(
        "Delete Pemilik from Admin - Response body:",
        error.message
      );
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
          result = await prisma.pemilik.findMany({
            orderBy: {
              id_pemilik: "asc", // Urutkan berdasarkan id_pemilik dalam urutan naik (ascending)
            },
          });
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
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      console.log("User:", user);
      console.log("User role:", user.role);
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // const id_pemilik = parseInt(req.params.id, 10); // Konversi ke integer
      // if (isNaN(id_pemilik)) {
      //   console.log("Invalid id_pemilik provided:", req.params.id);
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "ID Pemilik tidak valid." });
      // }
      
      const idPemilik = user.id_pemilik;
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      console.log("ID pemilik yang digunakan:", idPemilik); //
      let result;

      switch (action) {
        case "read":
          console.log("Fetching data for pemilik ID:", idPemilik);
          result = await prisma.pemilik.findUnique({
            where: { id_pemilik: idPemilik },
          });
          if (!result) {
            console.log("Pemilik not found for ID:", id_pemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik not found." });
          }
          break;

        case "update":
          console.log("Updating data for pemilik ID:", id_pemilik);
          if (!data) {
            console.log("Missing data in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data pemilik tidak lengkap." });
          }

          // Hapus id_pemilik dari data yang akan diupdate
          const { id_pemilik: dataIdPemilik, password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          result = await prisma.pemilik.update({
            where: { id_pemilik: id_pemilik }, // Gunakan id dari parameter URL
            data: { ...updateData }, // Kirim data tanpa id_pemilik
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
      console.error("Error in pemilikCRUDDataPemilik:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPemilikController;
