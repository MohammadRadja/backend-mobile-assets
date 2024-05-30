import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  // Admin: CRUD semua tabel
  adminCRUDAppointment: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { tableName } = req;
      if (tableName !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          // Proses pembuatan data baru
          result = await prisma.appointment.create({
            data: {
              tgl_appointment: data.tgl_appointment,
              catatan: data.catatan,
            },
          });
          break;
        case "read":
          result = await prisma.appointment.findMany();
          break;
        case "update":
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDHewan: async (req, res) => {
    try {
      const { tableName } = req;
      if (tableName !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          // Proses pembuatan data baru
          result = await prisma.appointment.create({
            data: {
              tgl_appointment: data.tgl_appointment,
              catatan: data.catatan,
            },
          });
          break;
        case "read":
          result = await prisma.appointment.findMany();
          break;
        case "update":
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment },
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

  // Pemilik: Hanya dapat melihat data
  pemilikReadHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { tableName } = req;
      if (tableName !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.appointment.findMany();
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default hewanController;
