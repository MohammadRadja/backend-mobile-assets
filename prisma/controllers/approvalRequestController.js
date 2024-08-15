import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const approvalRequestController = {
  ApprovalReadByPetugas: async (req, res) => {
    try {
      const { user } = req;

      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const approvals = await prisma.approval.findMany({
        include: {
          request: true,
          user: true,
        },
      });

      return res.status(200).json({ success: true, data: approvals });
    } catch (error) {
      console.error("Error di ApprovalReadByPetugas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  ApprovalReadByManajer: async (req, res) => {
    try {
      const { user } = req;

      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const approvals = await prisma.approval.findMany({
        include: {
          request: true,
          user: true,
        },
      });

      return res.status(200).json({ success: true, data: approvals });
    } catch (error) {
      console.error("Error di ApprovalReadByManajer:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  approveByPetugas: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      if (!requestID) {
        return res
          .status(400)
          .json({ success: false, message: "requestID tidak boleh kosong" });
      }

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "status tidak boleh kosong" });
      }

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      if (!Array.isArray(request.approval)) {
        return res
          .status(400)
          .json({ success: false, message: "Data approval tidak valid" });
      }

      // Memastikan status permintaan tidak dalam keadaan 'pending'
      if (request.status === "proses") {
        return res.status(400).json({
          success: false,
          message: "Anda sudah melakukan approval/rejected",
        });
      }

      // Memastikan status permintaan tidak dalam keadaan 'proses'
      const existingApprovalPetugas = request.approval.find(
        (approval) => approval.requestID === requestID
      );

      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: "proses" },
      });

      await prisma.approval.update({
        where: { id_approval: existingApprovalPetugas.id_approval },
        data: {
          status: "proses",
        },
      });

      return res.status(200).json({
        success: true,
        message: `Request berhasil ${
          status === "approved" ? "disetujui" : "ditolak"
        }`,
      });
    } catch (error) {
      console.error("Error di approveByPetugas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  approveByManajer: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      if (!requestID) {
        return res
          .status(400)
          .json({ success: false, message: "requestID tidak boleh kosong" });
      }

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "status tidak boleh kosong" });
      }

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      if (!Array.isArray(request.approval)) {
        return res
          .status(400)
          .json({ success: false, message: "Data approval tidak valid" });
      }

      // Memastikan status permintaan tidak dalam keadaan 'disetujui' atau 'ditolak'
      if (request.status === "disetujui" || request.status === "ditolak") {
        return res.status(400).json({
          success: false,
          message: "Anda sudah melakukan approval/rejected",
        });
      }

      // Memastikan status permintaan dalam keadaan 'proses'
      if (request.status !== "proses") {
        return res.status(400).json({
          success: false,
          message: "Permintaan tidak dalam keadaan diproses",
        });
      }

      // Cari approval petugas
      const existingApproval = request.approval.find(
        (approval) => approval.requestID === requestID
      );

      // if (!existingApproval) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "Approval dari petugas tidak ditemukan",
      //   });
      // }

      // Memeriksa status approval petugas
      if (existingApproval.status === "rejected") {
        return res.status(400).json({
          success: false,
          message: "Permintaan sudah ditolak oleh petugas",
        });
      }

      const newStatus = status === "approved" ? "disetujui" : "ditolak";

      // Update status request
      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: newStatus },
      });

      // Update status approval petugas
      await prisma.approval.update({
        where: { id_approval: existingApproval.id_approval },
        data: { status: status },
      });

      return res.status(200).json({
        success: true,
        message: `Request berhasil ${
          status === "approved" ? "disetujui" : "ditolak"
        }`,
      });
    } catch (error) {
      console.error("Error di approveByManajer:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  rejectedByPetugas: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      if (!requestID) {
        return res
          .status(400)
          .json({ success: false, message: "requestID tidak boleh kosong" });
      }

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "status tidak boleh kosong" });
      }

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      // Memastikan status permintaan tidak dalam keadaan 'pending'
      if (request.status === "proses") {
        return res.status(400).json({
          success: false,
          message: "Anda sudah melakukan approval/rejected",
        });
      }

      // Cari approval petugas
      const existingApproval = request.approval.find(
        (approval) => approval.requestID === requestID
      );

      const newStatus = status === "rejected" ? "ditolak" : request.status;
      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: newStatus },
      });

      await prisma.approval.update({
        where: { id_approval: existingApproval.id_approval },
        data: {
          status: status,
        },
      });

      return res.status(200).json({
        success: true,
        message: `Request berhasil ${
          status === "rejected" ? "ditolak" : "diproses ulang"
        }`,
      });
    } catch (error) {
      console.error("Error di rejectedByPetugas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  rejectedByManajer: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      if (!requestID) {
        return res
          .status(400)
          .json({ success: false, message: "requestID tidak boleh kosong" });
      }

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "status tidak boleh kosong" });
      }

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      // Memastikan status permintaan tidak dalam keadaan 'ditolak'
      if (request.status === "ditolak") {
        return res.status(400).json({
          success: false,
          message: "Permintaan sudah ditolak sebelumnya",
        });
      }

      // Pastikan status permintaan dalam keadaan 'proses'
      if (request.status !== "proses") {
        return res.status(400).json({
          success: false,
          message: "Permintaan tidak dalam keadaan diproses",
        });
      }

      // Ambil ID pengguna yang memiliki jabatan 'petugas'
      const petugas = await prisma.user.findFirst({
        where: { jabatan: "petugas" },
        select: { id_user: true },
      });

      if (!petugas) {
        return res.status(404).json({
          success: false,
          message: "Pengguna petugas tidak ditemukan",
        });
      }
      // Cari approval petugas
      const existingApproval = request.approval.find(
        (approval) => approval.requestID === requestID
      );

      const newStatus = status === "rejected" ? "ditolak" : request.status;
      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: newStatus },
      });

      await prisma.approval.update({
        where: { id_approval: existingApproval.id_approval },
        data: {
          status: status,
        },
      });

      return res.status(200).json({
        success: true,
        message: `Request berhasil ${
          status === "rejected" ? "ditolak" : "diproses ulang"
        }`,
      });
    } catch (error) {
      console.error("Error di rejectedByManajer:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default approvalRequestController;
