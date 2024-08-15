import { PrismaClient } from "@prisma/client";
import { request } from "express";
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
 * @throws {Error} - Jika tidak dapat menghasilkan kode unik.
 */
const generateRequestCode = async () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  let sequenceNumber = 1;

  while (true) {
    const requestCode = `REQ${year}${month}${date}${String(
      sequenceNumber
    ).padStart(4, "0")}`;

    const existingRequest = await prisma.request.findUnique({
      where: { kode_request: requestCode },
    });

    if (!existingRequest) {
      return requestCode; // Kode unik ditemukan
    }

    sequenceNumber++;
    if (sequenceNumber > 9999) {
      throw new Error("Unable to generate unique request code.");
    }
  }
};

// Controller untuk mengelola CRUD permintaan
const requestController = {
  // Fungsi untuk mengelola CRUD permintaan oleh admin
  manajerCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran petugas
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "create":
          const requiredFields = [
            "kode_cabang",
            "id_user",
            "id_barang",
            "id_satuan",
            "tanggal_request",
            "jumlah_barang",
            "keperluan",
            "status",
          ];

          for (const field of requiredFields) {
            if (!data[field]) {
              return res.status(400).json({
                success: false,
                message: `Field ${field} tidak boleh kosong`,
              });
            }
          }

          const requestCode = await generateRequestCode();
          result = await prisma.$transaction(async (prisma) => {
            const newRequest = await prisma.request.create({
              data: {
                kode_request: requestCode,
                cabang: { connect: { kode_cabang: data.kode_cabang } },
                user: { connect: { id_user: data.id_user } },
                barang: { connect: { id_barang: data.id_barang } },
                satuan_barang: { connect: { id_satuan: data.id_satuan } },
                tanggal_request: parseDate(data.tanggal_request),
                department: data.department,
                jumlah_barang: data.jumlah_barang,
                keperluan: data.keperluan,
                status: "pending",
              },
            });

            await prisma.approval.create({
              data: {
                userID: data.id_user,
                requestID: newRequest.kode_request,
                status: "pending",
              },
            });

            return newRequest;
          });

          return res.status(200).json({
            success: true,
            message: "Permintaan dan approval berhasil dibuat",
            data: result,
          });

        case "read":
          result = await prisma.request.findMany({
            orderBy: { kode_request: "asc" },
            include: {
              user: { select: { username: true } },
              barang: { select: { nama_barang: true } },
              satuan_barang: { select: { nama_satuan: true } },
            },
          });
          break;

        case "update":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

          result = await prisma.request.update({
            where: { kode_request: data.kode_request },
            data: { ...data, tanggal_request: parseDate(data.tanggal_request) },
          });
          break;

        case "delete":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });
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

  // Fungsi untuk mengelola CRUD permintaan oleh petugas
  petugasCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran petugas
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "create":
          const requiredFields = [
            "kode_cabang",
            "id_user",
            "id_barang",
            "id_satuan",
            "tanggal_request",
            "jumlah_barang",
            "keperluan",
            "status",
          ];

          for (const field of requiredFields) {
            if (!data[field]) {
              return res.status(400).json({
                success: false,
                message: `Field ${field} tidak boleh kosong`,
              });
            }
          }

          const requestCode = await generateRequestCode();

          result = await prisma.request.create({
            data: {
              kode_request: requestCode,
              cabang: { connect: { kode_cabang: data.kode_cabang } },
              user: { connect: { id_user: data.id_user } },
              barang: { connect: { id_barang: data.id_barang } },
              satuan_barang: { connect: { id_satuan: data.id_satuan } },
              tanggal_request: parseDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: "pending",
            },
          });

          return res.status(201).json({
            success: true,
            message: "Permintaan berhasil dibuat",
            data: result,
          });

        case "read":
          result = await prisma.request.findMany({
            select: {
              kode_request: true,
              kode_cabang: true,
              id_user: true,
              user: { select: { username: true } },
              id_barang: true,
              barang: { select: { nama_barang: true } },
              id_satuan: true,
              satuan_barang: { select: { nama_satuan: true } },
              tanggal_request: true,
              department: true,
              jumlah_barang: true,
              keperluan: true,
              status: true,
            },
          });

          return res.status(200).json({ success: true, data: result });

        case "update":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

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

          return res.status(200).json({ success: true, data: result });

        case "delete":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });

          return res.status(200).json({ success: true, data: result });

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
    } catch (error) {
      console.error("Error di petugasCRUDRequest:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Fungsi untuk mengelola CRUD permintaan oleh pegawai
  pegawaiCRUDRequest: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran petugas
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const { action, data } = req.body;

      let result;

      switch (action) {
        case "create":
          const requiredFields = [
            "kode_cabang",
            "id_user",
            "id_barang",
            "id_satuan",
            "tanggal_request",
            "jumlah_barang",
            "keperluan",
            "status",
          ];

          for (const field of requiredFields) {
            if (!data[field]) {
              return res.status(400).json({
                success: false,
                message: `Field ${field} tidak boleh kosong`,
              });
            }
          }

          const requestCode = await generateRequestCode();

          result = await prisma.request.create({
            data: {
              kode_request: requestCode,
              cabang: { connect: { kode_cabang: data.kode_cabang } },
              user: { connect: { id_user: data.id_user } },
              barang: { connect: { id_barang: data.id_barang } },
              satuan_barang: { connect: { id_satuan: data.id_satuan } },
              tanggal_request: parseDate(data.tanggal_request),
              department: data.department,
              jumlah_barang: data.jumlah_barang,
              keperluan: data.keperluan,
              status: "pending",
            },
          });

          return res.status(201).json({
            success: true,
            message: "Permintaan berhasil dibuat",
            data: result,
          });

        case "read":
          result = await prisma.request.findMany({
            where: { id_user: user.id_user },
            select: {
              kode_request: true,
              kode_cabang: true,
              id_user: true,
              user: { select: { username: true } },
              id_barang: true,
              barang: { select: { nama_barang: true } },
              id_satuan: true,
              satuan_barang: { select: { nama_satuan: true } },
              tanggal_request: true,
              department: true,
              jumlah_barang: true,
              keperluan: true,
              status: true,
            },
          });

          return res.status(200).json({ success: true, data: result });

        case "update":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToUpdate = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

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

          return res.status(200).json({ success: true, data: result });

        case "delete":
          if (!data.kode_request) {
            return res
              .status(400)
              .json({ success: false, message: "Kode permintaan hilang" });
          }

          const requestToDelete = await prisma.request.findUnique({
            where: { kode_request: data.kode_request },
          });

          if (!requestToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Permintaan tidak ditemukan" });
          }

          result = await prisma.request.delete({
            where: { kode_request: data.kode_request },
          });

          return res.status(200).json({ success: true, data: result });

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
    } catch (error) {
      console.error("Error di pegawaiCRUDRequest:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default requestController;
