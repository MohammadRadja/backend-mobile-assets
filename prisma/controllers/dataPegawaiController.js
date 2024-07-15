import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
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
        // case "create":
        //   result = await prisma.pegawai.create({
        //     data: {
        //       username: data.username,
        //       jabatan: data.jabatan,
        //       alamat: data.alamat,
        //       no_telp: data.no_telp,
        //     },
        //   });
        //   break;

        case "read":
          result = await prisma.pegawai.findMany();
          break;

        case "update":
          result = await prisma.pegawai.update({
            where: { id_pegawai: data.id_pegawai },
            data: { ...data },
          });
          break;

        // case "delete":
        //   result = await prisma.pegawai.delete({
        //     where: { id_pegawai: data.id_pegawai },
        //   });
        //   break;
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

export default dataPegawaiController;
