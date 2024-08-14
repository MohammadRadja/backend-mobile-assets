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
          const existingBarang = await prisma.barang.findFirst({
            where: { nama_barang: data.nama_barang },
          });

          if (existingBarang) {
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
          const { id_barang, id_satuan, ...updateData } = data; // Ambil id_satuan dari data

          result = await prisma.barang.update({
            where: { id_barang: data.id_barang },
            data: {
              ...updateData, // Sertakan data lain yang ingin diupdate
              satuan_barang: {
                // Update relasi satuan_barang
                connect: { id_satuan: data.id_satuan }, // Hubungkan ke satuan baru
              },
            },
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
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          // Membuat data baru
          result = await prisma.barang.create({
            data: {
              id_user: data.id_user,
              nama_barang: data.nama_barang,
              jenis_barang: data.jenis_barang,
              id_satuan: data.id_satuan,
              harga: data.harga,
              stok_awal: data.stok_awal,
              terpakai: data.terpakai,
              sisa: data.sisa,
            },
            include: {
              satuan_barang: true,
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
              satuan_barang: true, // Menyertakan satuan yang terkait jika perlu
            },
          });
          console.log("Data barang berhasil dibaca:", result);
          break;

        case "update":
          const {
            id_barang: idBarangToUpdate,
            id_satuan,
            ...updateDataPetugas
          } = data;

          try {
            // Menyiapkan data pembaruan
            const updateData = {
              ...updateDataPetugas,
              // Jika id_satuan diberikan, kita sambungkan ke satuan_barang
              ...(id_satuan && {
                satuan_barang: {
                  connect: { id_satuan }, // Menghubungkan id_satuan yang baru
                },
              }),
            };

            // Melakukan pembaruan
            result = await prisma.barang.update({
              where: { id_barang: idBarangToUpdate },
              data: updateData,
            });

            console.log("Barang berhasil diperbarui oleh pegawai:", result);
          } catch (error) {
            console.error("Kesalahan saat memperbarui barang:", error);
          }
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

      // Memastikan pengguna memiliki peran pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
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
          // Mengambil barang untuk pegawai
          const barangResult = await prisma.barang.findMany({
            orderBy: {
              id_barang: "asc",
            },
            include: {
              satuan_barang: true, // Menyertakan satuan yang terkait
            },
          });

          if (barangResult.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Tidak ada barang ditemukan untuk pegawai ini.",
            });
          }

          console.log(
            "Data barang berhasil dibaca oleh pegawai:",
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
