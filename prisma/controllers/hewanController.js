import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  // Admin: CRUD semua tabel
  adminCRUDHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { user } = req;
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Destructure action dan data dari req.body
      const { action, data } = req.body;
      console.log("Data diterima:", data); // Log data yang diterima
      let result;

      switch (action) {
        case "create":
          // Validasi input data
          if (
            !data.id_pemilik ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            console.log("Missing or invalid required fields", data); // Log untuk detail lebih lanjut
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Proses pembuatan data baru
          result = await prisma.hewan.create({
            data: {
              id_pemilik: data.id_pemilik,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
          });
          break;

        case "read":
          result = await prisma.hewan.findMany({
            include: {
              pemilik: true, // Assuming the relation name is 'pemilik'
            },
          });
          break;

        case "update":
          // Extract valid fields for update
          const { id_hewan, ...updateData } = data;

          // Update data including relation
          result = await prisma.hewan.update({
            where: { id_hewan },
            data: updateData,
            include: {
              pemilik: true,
            },
          });
          break;

        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in adminCRUDHewan:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDHewan: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          // Validasi input data
          if (
            !data.id_pemilik ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Proses pembuatan data baru
          result = await prisma.hewan.create({
            data: {
              id_pemilik: data.id_pemilik,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
            include: {
              pemilik: true,
            },
          });
          break;
        case "read":
          result = await prisma.hewan.findMany({
            include: {
              pemilik: true, // Assuming the relation name is 'pemilik'
            },
          });
          break;

        case "update":
          const {
            id_hewan: idHewanToUpdate,
            id_pemilik: idPemilikToUpdate,
            ...updateDataPegawai
          } = data; // Extract id_hewan and id_pemilik from data

          const updatePayloadPegawai = {
            where: { id_hewan: idHewanToUpdate },
            data: {
              ...updateDataPegawai,
              pemilik: {
                connect: { id_pemilik: idPemilikToUpdate },
              },
            },
            include: {
              pemilik: true,
            },
          };

          try {
            result = await prisma.hewan.update(updatePayloadPegawai);
            console.log("Update Hewan successful:", result);
          } catch (error) {
            console.error("Update Hewan failed:", error);
            throw new Error("Failed to update Hewan");
          }
          break;
        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pegawaiCRUDHewan:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Received action:", action); // Log action
      let result;

      switch (action) {
        case "read":
          if (!data || !data.id_pemilik) {
            console.log("Missing id_pemilik in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "ID pemilik tidak ditemukan." });
          }
          result = await prisma.hewan.findMany({
            where: { id_pemilik: data.id_pemilik },
            include: {
              pemilik: true, // Assuming the relation name is 'pemilik'
            },
          });
          break;

        default:
          console.log("Invalid action:", action); // Log invalid action
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pemilikReadHewan:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default hewanController;
