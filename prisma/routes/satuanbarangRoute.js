import express from "express";
import {
  authenticateToken,
  isManager,
  isOfficer,
  isEmployee,
} from "../middlewares/authMiddleware.js";
import satuanBarangController from "../controllers/satuanbarangController.js";

const router = express.Router();

/**
 * @route POST /manajer/satuanbarang
 * @desc Manajer: Membuat satuan barang baru
 * @access Private (Manajer)
 */
router.post(
  "/manajer/satuanbarang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.manajerCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dibuat oleh manajer:", result);
    } catch (error) {
      console.error("Gagal membuat satuan barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route GET /manajer/satuanbarang
 * @desc Manajer: Mendapatkan daftar satuan barang
 * @access Private (Manajer)
 */
router.get(
  "/manajer/satuanbarang",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.manajerCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diambil oleh manajer:", result);
    } catch (error) {
      console.error("Gagal mendapatkan satuan barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /manajer/satuanbarang/:id
 * @desc Manajer: Mengedit satuan barang
 * @access Private (Manajer)
 */
router.put(
  "/manajer/satuanbarang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.manajerCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diperbarui oleh manajer:", result);
    } catch (error) {
      console.error("Gagal memperbarui satuan barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /manajer/satuanbarang/:id
 * @desc Manajer: Menghapus satuan barang
 * @access Private (Manajer)
 */
router.delete(
  "/manajer/satuanbarang/:id",
  authenticateToken,
  isManager,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.manajerCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dihapus oleh manajer:", result);
    } catch (error) {
      console.error("Gagal menghapus satuan barang oleh manajer:", error);
      next(error);
    }
  }
);

/**
 * @route POST /petugas/satuanbarang
 * @desc Petugas: Membuat satuan barang baru
 * @access Private (Petugas)
 */
router.post(
  "/petugas/satuanbarang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.petugasCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dibuat oleh petugas:", result);
    } catch (error) {
      console.error("Gagal membuat satuan barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route GET /petugas/satuanbarang
 * @desc Petugas: Mendapatkan daftar satuan barang
 * @access Private (Petugas)
 */
router.get(
  "/petugas/satuanbarang",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.petugasCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diambil oleh petugas:", result);
    } catch (error) {
      console.error("Gagal mendapatkan satuan barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /petugas/satuanbarang/:id
 * @desc Petugas: Mengedit satuan barang
 * @access Private (Petugas)
 */
router.put(
  "/petugas/satuanbarang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.petugasCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diperbarui oleh petugas:", result);
    } catch (error) {
      console.error("Gagal memperbarui satuan barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /petugas/satuanbarang/:id
 * @desc Petugas: Menghapus satuan barang
 * @access Private (Petugas)
 */
router.delete(
  "/petugas/satuanbarang/:id",
  authenticateToken,
  isOfficer,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.petugasCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dihapus oleh petugas:", result);
    } catch (error) {
      console.error("Gagal menghapus satuan barang oleh petugas:", error);
      next(error);
    }
  }
);

/**
 * @route POST /pegawai/satuanbarang
 * @desc Pegawai: Membuat satuan barang baru
 * @access Private (Pegawai)
 */
router.post(
  "/pegawai/satuanbarang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.pegawaiCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dibuat oleh pegawai:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal membuat satuan barang oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route GET /pegawai/satuanbarang
 * @desc Pegawai: Mendapatkan daftar satuan barang
 * @access Private (Pegawai)
 */
router.get(
  "/pegawai/satuanbarang",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.pegawaiCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diambil oleh pegawai:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal mendapatkan satuan barang oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route PUT /pegawai/satuanbarang/:id
 * @desc Pegawai: Mengedit satuan barang
 * @access Private (Pegawai)
 */
router.put(
  "/pegawai/satuanbarang/:id",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.pegawaiCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil diperbarui oleh pegawai:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Gagal memperbarui satuan barang oleh pegawai:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /pegawai/satuanbarang/:id
 * @desc Pegawai: Menghapus satuan barang
 * @access Private (Pegawai)
 */
router.delete(
  "/pegawai/satuanbarang/:id",
  authenticateToken,
  isEmployee,
  async (req, res, next) => {
    try {
      const result = await satuanBarangController.pegawaiCRUDSatuanBarang(
        req,
        res
      );
      console.log("Satuan barang berhasil dihapus oleh pegawai:", result);
      res.status(204).send();
    } catch (error) {
      console.error("Gagal menghapus satuan barang oleh pegawai:", error);
      next(error);
    }
  }
);

export default router;
