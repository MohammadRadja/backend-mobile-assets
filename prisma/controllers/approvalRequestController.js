import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fungsi untuk mengelola approval permintaan oleh petugas atau manajer.
 * @param {Object} req - Objek request.
 * @param {Object} res - Objek response.
 */
const approvalRequestController = {
  /**
   * Fungsi untuk approval permintaan oleh petugas.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  approveByPetugas: async (req, res) => {
    try {
      const { user } = req;
      console.log("User dari request:", user);

      // Verifikasi peran pengguna
      if (user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      if (!request.approval) {
        return res
          .status(400)
          .json({ success: false, message: "Data approval tidak valid" });
      }

      // Log request untuk debugging
      console.log("Request yang ditemukan:", request);

      // Cek apakah petugas sudah melakukan approval
      const existingApproval = request.approval.find(
        (approval) => approval.userID === user.id_user
      );
      if (existingApproval) {
        return res.status(400).json({
          success: false,
          message: "Anda sudah melakukan approval",
        });
      }

      // Update status request berdasarkan hasil approval
      const newStatus = status === "approved" ? "proses" : "ditolak";
      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: newStatus },
      });

      await prisma.approval.create({
        data: {
          status: status,
          requestID: request.kode_request,
          userID: user.id_user,
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

  /**
   * Fungsi untuk approval permintaan oleh manajer.
   * @param {Object} req - Objek request.
   * @param {Object} res - Objek response.
   */
  approveByManajer: async (req, res) => {
    try {
      const { user } = req;

      // Memeriksa apakah pengguna adalah manajer
      if (user.jabatan !== "manajer") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { requestID, status } = req.body;

      const request = await prisma.request.findUnique({
        where: { kode_request: requestID },
        include: { approval: true },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Permintaan tidak ditemukan" });
      }

      if (!request.approval || !Array.isArray(request.approval)) {
        return res.status(400).json({
          success: false,
          message: "Data approval tidak valid",
        });
      }

      // Cek apakah request sudah ditolak oleh petugas
      if (request.status === "ditolak") {
        return res.status(400).json({
          success: false,
          message: "Permintaan sudah ditolak oleh petugas",
        });
      }

      // Cek apakah manajer sudah melakukan approval
      const existingApproval = request.approval.find(
        (approval) => approval.userID === user.id_user
      );
      if (existingApproval) {
        return res.status(400).json({
          success: false,
          message: "Anda sudah melakukan approval",
        });
      }

      // Update status request berdasarkan hasil approval
      const newStatus = status === "approved" ? "disetujui" : "ditolak";
      await prisma.request.update({
        where: { kode_request: request.kode_request },
        data: { status: newStatus },
      });

      await prisma.approval.create({
        data: {
          status: status,
          requestID: request.kode_request,
          userID: user.id_user,
        },
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
};

export default approvalRequestController;
