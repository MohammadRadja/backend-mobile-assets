import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const exportDetailRequestController = {
  /**
   * Mengekspor detail request ke PDF.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  exportDetailRequestToPDF: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer, pegawai, atau petugas
      if (user.jabatan !== "manajer" && user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const result = await prisma.detailRequest.findMany({
        orderBy: {
          kode_request: "asc",
        },
        select: {
          kode_request: true,
          nama_pegawai: true,
          nama_barang: true,
          status: true,
          qty_request: true,
          subtotal: true,
        },
      });

      // Validasi: Pastikan ada data detail request
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Laporan detail request tidak ditemukan",
        });
      }

      // Membuat dokumen PDF
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LaporanDetailRequest.pdf"
      );

      doc.pipe(res);

      // Menambahkan logo
      // const logoPath = "/prisma/services/Logo/Assets/Logo/logo.png"; // Ganti dengan path ke logo Anda
      // doc.image(logoPath, { width: 100, align: "center" });
      // doc.moveDown(0.5);

      // Menambahkan judul
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Laporan Detail Request", { align: "center" });
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("PT Mitra Teknologi", { align: "center" });
      doc.moveDown(1);

      // Menambahkan tanggal
      const date = new Date().toLocaleDateString("id-ID");
      doc.fontSize(10).text(`Tanggal: ${date}`, { align: "left" });
      doc.moveDown(1);

      // Menambahkan header tabel
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(
          "No | Kode Request | Nama Pegawai | Nama Barang | Status | Qty Request | Subtotal ",
          {
            align: "center", // Ubah alignment ke left
            width: 500,
          }
        );
      doc.moveDown(0.5);

      // Menambahkan garis pemisah
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.2);

      // Menambahkan data ke tabel dengan penomoran
      result.forEach((item, index) => {
        const nomor = (index + 1).toString().padEnd(3); // Menambahkan penomoran

        // Format string untuk menjaga keselarasan
        const kodeRequest = item.kode_request.padEnd(10); // 20 karakter
        const namaPegawai = item.nama_pegawai.padEnd(10); // 20 karakter
        const namaBarang = item.nama_barang.padEnd(15); // 20 karakter
        const status = item.status.padEnd(8); // 10 karakter
        const qtyRequest = item.qty_request.toString().padEnd(5); // 12 karakter
        const subtotal = item.subtotal.toString().padEnd(5); // 12 karakter

        doc.fontSize(12).font("Helvetica").text(
          `${nomor} | ${kodeRequest} | ${namaPegawai} | ${namaBarang} | ${status} | ${qtyRequest} | ${subtotal}`,
          { align: "center", width: 425 } // Batasi lebar teks
        );
        doc.moveDown(0.2);
      });

      // Menambahkan garis pemisah di akhir tabel
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.end();
    } catch (error) {
      console.error("Error in Export Detail Request to PDF:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengekspor detail request ke Excel.
   * @param {Object} req - Permintaan HTTP.
   * @param {Object} res - Respon HTTP.
   */
  exportDetailRequestToExcel: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer, pegawai, atau petugas
      if (user.jabatan !== "manajer" && user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const result = await prisma.detailRequest.findMany({
        orderBy: {
          kode_request: "asc",
        },
        select: {
          kode_request: true,
          nama_pegawai: true,
          nama_barang: true,
          status: true,
          qty_request: true,
          subtotal: true,
        },
      });

      // Validasi: Pastikan ada data detail request
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Laporan Detail Request tidak ditemukan",
        });
      }

      // Membuat workbook Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Detail Request");

      worksheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Kode Request", key: "kode_request", width: 15 },
        { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
        { header: "Nama Barang", key: "nama_barang", width: 20 },
        { header: "Status", key: "status", width: 10 },
        { header: "Quantity Request", key: "qty_request", width: 20 },
        { header: "Subtotal", key: "subtotal", width: 15 },
      ];

      // Menambahkan data ke worksheet
      result.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1, // Penomoran
          kode_request: item.kode_request,
          nama_pegawai: item.nama_pegawai,
          nama_barang: item.nama_barang,
          status: item.status,
          qty_request: item.qty_request,
          subtotal: item.subtotal.toFixed(2), // Format mata uang
        });
      });

      // Menambahkan format header
      worksheet.getRow(1).font = { bold: true };
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Mengatur lebar kolom
      worksheet.columns.forEach((column) => {
        column.width = column.width + 5; // Menambah lebar kolom
      });

      // Mengatur style worksheet
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };

      // Mengatur header respons
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=LaporanDetailRequest-${timestamp}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error in Export Detail Request to Excel:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default exportDetailRequestController;
