import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Mengonversi string tanggal ke format ISO-8601.
 * @param {string} dateStr - String tanggal dalam format DD-MM-YYYY atau ISO-8601.
 * @returns {string} - Tanggal dalam format ISO-8601.
 * @throws {Error} - Jika format tanggal tidak valid.
 */
const parseDate = (dateStr) => {
  // Jika sudah dalam format ISO-8601, langsung kembalikan
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Format tanggal tidak valid: ${dateStr}`);
    }
    return date.toISOString();
  }

  // Jika dalam format DD-MM-YYYY, lakukan konversi
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Format tanggal tidak valid: ${dateStr}`);
  }
  date.setUTCHours(0, 0, 0, 0); // Mengatur waktu ke 00:00:00 UTC
  return date.toISOString();
};

/**
 * Memformat tanggal ke format DD-MM-YYYY.
 * @param {Date} date - Objek tanggal.
 * @returns {string} - Tanggal dalam format DD-MM-YYYY.
 */
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Menghasilkan kode request otomatis.
 * @returns {string} - Kode request dalam format REQYYMMDDNNNN.
 */
const generateRequestCode = async () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  let sequenceNumber = 1;
  let requestCode;

  while (true) {
    requestCode = `REQ${year}${month}${date}${String(sequenceNumber).padStart(
      4,
      "0"
    )}`;

    const existingRequest = await prisma.request.findUnique({
      where: { kode_request: requestCode },
    });

    if (!existingRequest) break;

    sequenceNumber++;
    if (sequenceNumber > 9999) {
      throw new Error("Unable to generate unique request code.");
    }
  }

  return requestCode;
};

const requestController = {
  /**
   * Fungsi untuk mengelola CRUD permintaan oleh admin.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  manajerCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memeriksa apakah pengguna adalah manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Aksi diterima:", action); // Log aksi yang diterima
      console.log("Data diterima:", data); // Log data yang diterima

      let result;

      switch (action) {
        case "create":
          // Menghasilkan kode request otomatis
          const requestCode = await generateRequestCode();
          console.log("Request Code generated:", requestCode); // Tambahkan log ini

          // Validasi input untuk aksi create
          if (
            !data.kode_cabang ||
            !data.id_user ||
            !data.id_barang ||
            !data.id_satuan ||
            !data.tanggal_request ||
            !data.jumlah_barang ||
            !data.keperluan ||
            !data.status
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }

          // Pastikan requestCode tidak kosong setelah di-generate
          if (!requestCode) {
            return res.status(400).json({
              success: false,
              message: "Kode request tidak dapat dihasilkan",
            });
          }
          result = await prisma.request.create({
            data: {
              kode_request: requestCode,
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: formatDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Permintaan berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data permintaan
          result = await prisma.request.findMany({
            orderBy: {
              kode_request: "asc",
            },
            select: {
              kode_request: true,
              kode_cabang: true,
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_barang: true,
              barang: {
                select: {
                  nama_barang: true,
                },
              },
              id_satuan: true,
              satuan_barang: {
                select: {
                  nama_satuan: true,
                },
              },
              tanggal_request: true,
              department: true,
              jumlah_barang: true,
              keperluan: true,
              status: true,
            },
          });
          console.log("Data Permintaan:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan diperbarui ditemukan:",
            requestToUpdate
          );

          // Perbarui data permintaan
          result = await prisma.request.update({
            where: { kode_request: data.kode_request },
            data: {
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: parseDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Validasi input untuk aksi delete
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum dihapus
          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan dihapus ditemukan:",
            requestToDelete
          );

          // Menghapus permintaan
          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });
          console.log("Delete berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di manajerCRUDRequest:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Fungsi untuk mengelola CRUD permintaan oleh petugas.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  petugasCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Verifikasi peran pengguna
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak sah" });
      }

      const { action, data } = req.body;
      console.log("Aksi diterima:", action); // Log aksi yang diterima
      console.log("Data diterima:", data); // Log data yang diterima

      let result;

      switch (action) {
        case "create":
          // Validasi input untuk aksi create
          if (
            !data.kode_cabang ||
            !data.id_user ||
            !data.id_barang ||
            !data.id_satuan ||
            !data.tanggal_request ||
            !data.jumlah_barang ||
            !data.keperluan ||
            !data.status
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }

          // Menghasilkan kode request otomatis
          const requestCode = await generateRequestCode();

          result = await prisma.request.create({
            data: {
              kode_request: requestCode, // Menggunakan kode yang dihasilkan
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: formatDate(data.tanggal_request), // Pastikan tanggal dalam format yang benar
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Permintaan berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data permintaan
          result = await prisma.request.findMany({
            orderBy: {
              kode_request: "asc",
            },
            select: {
              kode_request: true,
              kode_cabang: true,
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_barang: true,
              barang: {
                select: {
                  nama_barang: true,
                },
              },
              id_satuan: true,
              satuan_barang: {
                select: {
                  nama_satuan: true,
                },
              },
              tanggal_request: true,
              department: true,
              jumlah_barang: true,
              keperluan: true,
              status: true,
            },
          });
          console.log("Data Permintaan:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan diperbarui ditemukan:",
            requestToUpdate
          );

          // Perbarui data permintaan
          result = await prisma.request.update({
            where: { kode_request: data.kode_request },
            data: {
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: formatDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Validasi input untuk aksi delete
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum dihapus
          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan dihapus ditemukan:",
            requestToDelete
          );

          // Menghapus permintaan
          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });
          console.log("Delete berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di petugasCRUDRequest:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  pegawaiCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Verifikasi peran pengguna
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak sah" });
      }

      const idPegawai = user.id_user || ""; // Ganti dengan logika yang sesuai jika diperlukan
      const { action, data } = req.body;
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          // Validasi input untuk aksi create
          if (
            !data.kode_cabang ||
            !data.id_user ||
            !data.id_barang ||
            !data.id_satuan ||
            !data.tanggal_request ||
            !data.jumlah_barang ||
            !data.keperluan ||
            !data.status
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }

          // Menghasilkan kode request otomatis
          const requestCode = await generateRequestCode();

          result = await prisma.request.create({
            data: {
              kode_request: requestCode, // Menggunakan kode yang dihasilkan
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: parseDate(data.tanggal_request), // Pastikan tanggal dalam format yang benar
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Permintaan berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data permintaan
          result = await prisma.request.findMany({
            where: { id_user: idPegawai },
            orderBy: {
              kode_request: "asc",
            },
            select: {
              kode_request: true,
              kode_cabang: true,
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_barang: true,
              barang: {
                select: {
                  nama_barang: true,
                },
              },
              id_satuan: true,
              satuan_barang: {
                select: {
                  nama_satuan: true,
                },
              },
              tanggal_request: true,
              department: true,
              jumlah_barang: true,
              keperluan: true,
              status: true,
            },
          });
          console.log("Data Permintaan:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan diperbarui ditemukan:",
            requestToUpdate
          );

          // Perbarui data permintaan
          result = await prisma.request.update({
            where: { kode_request: data.kode_request },
            data: {
              kode_cabang: data.kode_cabang,
              id_user: data.id_user,
              id_barang: data.id_barang,
              id_satuan: data.id_satuan,
              tanggal_request: formatDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: data.status,
            },
          });
          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Validasi input untuk aksi delete
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum dihapus
          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }
          console.log(
            "Permintaan yang akan dihapus ditemukan:",
            requestToDelete
          );

          // Menghapus permintaan
          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });
          console.log("Delete berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error Pegawai In CRUD Request:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default requestController;
