import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// const to parse DD-MM-YYYY date to ISO-8601 format
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  console.log(`Parsed date from "${dateStr}" to "${date.toISOString()}"`);
  return date.toISOString(); // Corrected line
};
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const appointmentController = {
  // Admin: CRUD semua tabel
  adminCRUDAppointment: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          result = await prisma.appointment.create({
            data: {
              tgl_appointment: data.tgl_appointment,
              catatan: data.catatan,
            },
          });
          break;
        case "read":
          result = await prisma.appointment.findMany({
            orderBy: {
              id_appointment: "asc",
            },
            select: {
              id_appointment: true,
              id_pemilik: true,
              pemilik: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              tgl_appointment: true,
              catatan: true,
            },
          });
          result = result.map((appointment) => ({
            ...appointment,
            tgl_appointment: formatDate(new Date(appointment.tgl_appointment)),
          }));
          console.log("Data Appointment:", result);
          break;
        case "update":
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Appointment" });
          }
          result = await prisma.appointment.update({
            where: { id_appointment: parseInt(data.id_appointment, 10) }, // Ensure the id is an integer
            data: {
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          console.log("Update Succes:", result);
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
  pegawaiCRUDAppointment: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima ", data);
      let result;
      switch (action) {
        case "create":
          result = await prisma.appointment.create({
            data: {
              tgl_appointment: data.tgl_appointment,
              catatan: data.catatan,
            },
          });
          break;
        case "read":
          result = await prisma.appointment.findMany({
            orderBy: {
              id_appointment: "asc",
            },
            select: {
              id_appointment: true,
              id_pemilik: true,
              pemilik: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              tgl_appointment: true,
              catatan: true,
            },
          });
          result = result.map((appointment) => ({
            ...appointment,
            tgl_appointment: formatDate(new Date(appointment.tgl_appointment)),
          }));
          console.log("Data Appointment:", result);
          break;
        case "update":
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Appointment" });
          }
          result = await prisma.appointment.update({
            where: { id_appointment: parseInt(data.id_appointment, 10) }, // Ensure the id is an integer
            data: {
              id_pemilik: parseInt(data.id_pemilik, 10),
              id_hewan: parseInt(data.id_hewan, 10),
              id_dokter: parseInt(data.id_dokter, 10),
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          console.log("Update Succes:", result);
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
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadAppointment: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.appointment.findUnique({
            where: { id_pemilik: data.id_pemilik },
          });
          if (!result) {
            console.log("Pemilik not found for ID:", id_pemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik not found." });
          }
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

export default appointmentController;
