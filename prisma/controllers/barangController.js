import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const barangController = {
  /**
   * Manajer: Operasi CRUD untuk barang
   * @param {object} req - Objek permintaan
   * @param {object} res - Objek respons
   */
  manajerCRUDBarang: async (req, res) => {
    try {
      const { user } = req;
      // Memastikan pengguna memiliki peran manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Data diterima:", req.body);
      let result;

      switch (action) {
        case "create":
          // Validasi data input
          if (
            !data.nama_barang ||
            !data.jenis_barang ||
            !data.id_satuan ||
            data.harga == null ||
            data.stok_awal == null ||
            data.terpakai == null ||
            data.sisa == null
          ) {
            return res.status(400).json({
              success: false,
              message: "Input Data Barang tidak boleh kosong",
            });
          }

          // Cek apakah nama barang sudah ada
          const existingCabang = await prisma.cabang.findFirst({
            where: { nama_cabang: data.nama_cabang },
          });

          if (existingCabang) {
            return res
              .status(400)
              .json({ success: false, message: "Nama Barang sudah ada" });
          }

          // Membuat data baru
          result = await prisma.barang.create({
            data: {
              nama_barang: data.nama_barang,
              jenis_barang: data.jenis_barang,
              id_satuan: data.id_satuan,
              harga: data.harga,
              stok_awal: data.stok_awal,
              terpakai: data.terpakai,
              sisa: data.sisa,
            },
          });
          console.log("Barang berhasil dibuat:", result);
          break;

        case "read":
          result = await prisma.barang.findMany({
            orderBy: {
              id_barang: "asc",
            },
            include: {
              satuan_barang: true, // Menyertakan satuan yang terkait jika perlu
            },
          });
          console.log("Data barang berhasil dibaca:", result);
          break;

        case "update":
          const { id_barang, ...updateData } = data;

          result = await prisma.barang.update({
            where: { id_barang },
            data: updateData,
          });
          console.log("Barang berhasil diperbarui:", result);
          break;

        case "delete":
          result = await prisma.barang.delete({
            where: { id_barang: data.id_barang },
          });
          console.log("Barang berhasil dihapus:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error pada manajerCRUDBarang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Petugas: Operasi CRUD untuk barang
   * @param {object} req - Objek permintaan
   * @param {object} res - Objek respons
   */
  petugasCRUDBarang: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna memiliki peran pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          // Validasi data input
          if (
            !data.id_user ||
            !data.nama_barang ||
            !data.jenis_barang ||
            data.harga == null ||
            data.stok_awal == null ||
            data.terpakai == null ||
            data.sisa == null
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang dibutuhkan hilang",
            });
          }

          // Membuat data baru
          result = await prisma.barang.create({
            data: {
              id_user: data.id_user,
              nama_barang: data.nama_barang,
              jenis_barang: data.jenis_barang,
              harga: data.harga,
              stok_awal: data.stok_awal,
              terpakai: data.terpakai,
              sisa: data.sisa,
            },
            include: {
              user: true,
            },
          });
          console.log("Barang berhasil dibuat oleh pegawai:", result);
          break;

        case "read":
          result = await prisma.barang.findMany({
            orderBy: {
              id_barang: "asc",
            },
            include: {
              user: true,
            },
          });
          console.log("Data barang berhasil dibaca oleh pegawai:", result);
          break;

        case "update":
          const { id_barang: idBarangToUpdate, ...updateDataPetugas } = data;

          result = await prisma.barang.update({
            where: { id_barang: idBarangToUpdate },
            data: updateDataPetugas,
          });
          console.log("Barang berhasil diperbarui oleh pegawai:", result);
          break;

        case "delete":
          result = await prisma.barang.delete({
            where: { id_barang: data.id_barang },
          });
          console.log("Barang berhasil dihapus oleh pegawai:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error pada petugasCRUDBarang:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai: Hanya diizinkan untuk membaca data barang
   * @param {object} req - Objek permintaan
   * @param {object} res - Objek respons
   */
  pegawaiReadBarang: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna memiliki peran pemilik
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const idPegawai = user.id_user || "";
      if (!idPegawai) {
        console.log("ID pemilik tidak ditemukan dalam objek pengguna.");
        return res
          .status(400)
          .json({ success: false, message: "ID pemilik tidak ditemukan." });
      }

      const { action } = req.body;

      // Memastikan aksi ada
      if (!action) {
        console.log("Aksi tidak ada.");
        return res
          .status(400)
          .json({ success: false, message: "Aksi diperlukan." });
      }

      switch (action) {
        case "read":
          // Mengambil barang untuk pemilik
          const barangResult = await prisma.barang.findMany({
            orderBy: {
              id_barang: "asc",
            },
            where: { id_user: idPegawai },
            include: {
              satuan: true,
            },
          });

          if (barangResult.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Tidak ada barang ditemukan untuk pemilik ini.",
            });
          }

          console.log(
            "Data barang berhasil dibaca oleh pemilik:",
            barangResult
          );
          return res.status(200).json({ success: true, data: barangResult });

        default:
          console.log("Aksi tidak valid:", action);
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
    } catch (error) {
      console.error("Error pada pegawaiReadBarang:", error);
      return res
        .status(500)
        .json({ success: false, message: "Kesalahan server internal" });
    }
  },
};

export default barangController;
