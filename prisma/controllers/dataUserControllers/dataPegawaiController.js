import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const dataPegawaiController = {
  /**
   * Mengelola CRUD data pegawai oleh manajer.
   * @param {Object} req - Request object.
   * @param {Object} res - Response object.
   */
  manajerCRUDDataPegawai: async (req, res) => {
    try {
      // Pastikan user memiliki peran manajer
      const { user } = req;
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Action:", action);
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          const existUsername = await prisma.user.findFirst({
            where: { username: data.username },
          });
          if (existUsername) {
            return res.status(400).json({
              success: false,
              message: "Username Pegawai sudah ada",
            });
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.user.create({
            data: {
              username: data.username,
              password: hash,
              jabatan: data.jabatan,
            },
          });
          break;

        case "read":
          result = await prisma.user.findMany({
            where: { jabatan: "pegawai" },
            orderBy: { id_user: "asc" },
            select: {
              id_user: true,
              username: true,
              password: false,
              jabatan: true,
            },
          });
          break;

        case "update":
          let updateData = { ...data };
          if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            updateData.password = hash;
          }
          result = await prisma.user.update({
            where: { id_user: data.id_user },
            data: updateData,
          });
          console.log("Update Pegawai - Response status: 200");
          console.log("Update Pegawai - Response body:", result);
          break;

        case "delete":
          result = await prisma.user.delete({
            where: { id_user: data.id_user },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Pegawai dari Manajer - Response status: 500");
      console.error(
        "CRUD Pegawai dari Manajer - Response body:",
        error.message
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengelola CRUD data pegawai oleh petugas.
   * @param {Object} req - Request object.
   * @param {Object} res - Response object.
   */
  petugasCRUDDataPegawai: async (req, res) => {
    console.log("Request received:", req.method, req.path);
    try {
      const { user } = req;
      console.log("User:", user);
      console.log("User jabatan:", user.jabatan);
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Action:", action);
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          const existUsername = await prisma.user.findFirst({
            where: { username: data.username },
          });
          if (existUsername) {
            return res.status(400).json({
              success: false,
              message: "Username Pegawai sudah ada",
            });
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.user.create({
            data: {
              username: data.username,
              password: hash,
              jabatan: data.jabatan,
            },
          });
          break;

        case "read":
          result = await prisma.user.findMany({
            where: { jabatan: "pegawai" },
            orderBy: { id_user: "asc" },
          });
          break;

        case "update":
          let updateData = { ...data };
          if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            updateData.password = hash;
          }
          result = await prisma.user.update({
            where: { id_user: data.id_user },
            data: updateData,
          });
          console.log("Update Pegawai - Response status: 200");
          console.log("Update Pegawai - Response body:", result);
          break;

        case "delete":
          result = await prisma.user.delete({
            where: { id_user: data.id_user },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Membaca data pegawai oleh pegawai itu sendiri.
   * @param {Object} req - Request object.
   * @param {Object} res - Response object.
   */
  pegawaiReadDataPegawai: async (req, res) => {
    console.log("Request received:", req.method, req.path);
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const idPegawai = user.id_user || "";
      const { action, data } = req.body;
      console.log("Action:", action);
      console.log("Data diterima:", data);
      console.log("ID Pegawai yang digunakan:", idPegawai);
      let result;

      switch (action) {
        case "read":
          console.log("GET ID Pegawai:", idPegawai);
          result = await prisma.user.findUnique({
            where: { id_user: idPegawai },
          });
          if (!result) {
            console.log("ID Pegawai tidak ditemukan:", idPegawai);
            return res
              .status(404)
              .json({ success: false, message: "Pegawai tidak ditemukan." });
          }
          break;

        case "update":
          console.log("Updating data for Pegawai ID:", idPegawai);
          if (!data) {
            console.log("Data untuk update tidak lengkap:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data Pegawai tidak lengkap." });
          }

          const { id_user, password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          result = await prisma.user.update({
            where: { id_user: idPegawai },
            data: { ...updateData },
          });
          console.log("Update berhasil:", result);
          break;

        default:
          console.log("Aksi tidak valid diterima:", action);
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Read Pegawai dari pegawai - Response status: 500");
      console.error(
        "Read Pegawai dari pegawai - Response body:",
        error.message
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPegawaiController;
