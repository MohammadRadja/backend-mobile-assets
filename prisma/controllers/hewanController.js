import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  // Admin: CRUD semua tabel
  adminCRUDHewan: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { jabatan_admin } = req;
      if (jabatan_admin !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      // Destructure action dan data dari req.body
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
      const { jabatan_pegawai } = req;
      if (jabatan_pegawai !== "pegawai") {
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
          });
          break;
        case "read":
          result = await prisma.hewan.findMany();
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

          result = await prisma.hewan.update(updatePayloadPegawai);
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
      const { jabatan_pemilik } = req;
      if (jabatan_pemilik !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.hewan.findMany();
          break;
        default:
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
