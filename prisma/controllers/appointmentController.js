import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// const to parse DD-MM-YYYY date to ISO-8601 format
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  date.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
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
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "create":
          if (
            !data.id_pemilik ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          result = await prisma.appointment.create({
            data: {
              id_pemilik: data.id_pemilik,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
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
          // Check if the record exists before updating
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: parseInt(data.id_appointment, 10) },
          });
          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment to update found:", appointmentToUpdate);
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
          console.log("Update Success:", result);
          break;
        case "delete":
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Appointment" });
          }
          // Check if the record exists before deleting
          const appointment = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment },
          });
          if (!appointment) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment found:", appointment);
          // Check for related records
          const relatedRecords = await prisma.pembayaran.findMany({
            where: { id_appointment: data.id_appointment },
          });
          if (relatedRecords.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Cannot delete appointment with related records",
            });
          }
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment },
          });
          console.log("Delete Success:", result);
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      console.error("Error in adminCRUDAppointment:", error);
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
          if (
            !data.id_pemilik ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          result = await prisma.appointment.create({
            data: {
              id_pemilik: data.id_pemilik,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
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
          // Check if the record exists before updating
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: parseInt(data.id_appointment, 10) },
          });
          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment to update found:", appointmentToUpdate);
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
          console.log("Update Success:", result);
          break;
        case "delete":
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Appointment" });
          }
          // Check if the record exists before deleting
          const appointment = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment },
          });
          if (!appointment) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment found:", appointment);
          // Check for related records
          const relatedRecords = await prisma.pembayaran.findMany({
            where: { id_appointment: data.id_appointment },
          });
          if (relatedRecords.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Cannot delete appointment with related records",
            });
          }
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment },
          });
          console.log("Delete Success:", result);
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
  pemilikCRUDAppointment: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima ", data);
      let result;
      switch (action) {
        case "create":
          if (
            !data.id_pemilik ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          result = await prisma.appointment.create({
            data: {
              id_pemilik: data.id_pemilik,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          break;
        case "read":
          result = await prisma.appointment.findMany({
            where: {
              id_pemilik: data.id_pemilik,
            },
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
          // Check if the record exists before updating
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: parseInt(data.id_appointment, 10) },
          });
          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment to update found:", appointmentToUpdate);
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
          console.log("Update Success:", result);
          break;
        case "delete":
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "Missing ID Appointment" });
          }
          // Check if the record exists before deleting
          const appointment = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment },
          });
          if (!appointment) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment not found" });
          }
          console.log("Appointment found:", appointment);
          // Check for related records
          const relatedRecords = await prisma.pembayaran.findMany({
            where: { id_appointment: data.id_appointment },
          });
          if (relatedRecords.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Cannot delete appointment with related records",
            });
          }
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment },
          });
          console.log("Delete Success:", result);
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in adminCRUDAppointment:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default appointmentController;
