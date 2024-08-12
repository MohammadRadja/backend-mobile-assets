import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

const exportTransaksiController = {
  exportTransaksiToPDF: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer atau petugas
      if (user.jabatan !== "manajer" && user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const result = await prisma.transaksi.findMany({
        orderBy: { kode_request: "asc" },
        select: {
          kode_request: true,
          tanggal_request: true,
          nama_cabang: true,
          total_request: true,
        },
      });

      // Validasi: Pastikan ada data transaksi
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Laporan Transaksi tidak ditemukan",
        });
      }

      // Membuat dokumen PDF
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LaporanTransaksi.pdf"
      );

      doc.pipe(res);

      // Menambahkan judul
      doc.fontSize(18).text("Laporan Transaksi", { align: "center" });
      doc.fontSize(12).text("PT Mitra Teknologi", { align: "center" });
      doc.moveDown(1);

      // Menambahkan tanggal
      const date = new Date().toLocaleDateString("id-ID");
      doc.fontSize(10).text(`Tanggal: ${date}`, { align: "left" });
      doc.moveDown(1);

      // Menambahkan header tabel
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Kode Request | Tanggal Request | Nama Cabang | Total Request", {
          align: "center",
          underline: true,
        });
      doc.moveDown(0.5);

      // Menambahkan garis pemisah
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.2);

      // Menambahkan data ke tabel
      result.forEach((item) => {
        doc.text(
          `${item.kode_request} | ${
            item.tanggal_request.toISOString().split("T")[0]
          } | ${item.nama_cabang} | ${item.total_request}`,
          { align: "center" }
        );
        doc.moveDown(0.2);
      });

      // Menambahkan garis pemisah di akhir tabel
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.end();
    } catch (error) {
      console.error("Error in Export Transaksi to PDF:", error);
      // Cobalah untuk menghindari output JSON jika sudah mengalirkan PDF
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  exportTransaksiToExcel: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan pengguna adalah manajer atau petugas
      if (user.jabatan !== "manajer" && user.jabatan !== "petugas") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const result = await prisma.transaksi.findMany({
        orderBy: { kode_request: "asc" },
        select: {
          kode_request: true,
          tanggal_request: true,
          nama_cabang: true,
          total_request: true,
        },
      });

      // Validasi: Pastikan ada data transaksi
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Laporan Transaksi tidak ditemukan",
        });
      }

      // Membuat workbook Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Detail Transaksi");

      // Menambahkan header tabel
      worksheet.columns = [
        { header: "Kode Request", key: "kode_request", width: 15 },
        { header: "Tanggal Request", key: "tanggal_request", width: 20 },
        { header: "Nama Cabang", key: "nama_cabang", width: 25 },
        { header: "Total Request", key: "total_request", width: 20 },
      ];

      // Menambahkan data ke worksheet
      result.forEach((item) => {
        worksheet.addRow({
          kode_request: item.kode_request,
          tanggal_request: item.tanggal_request.toISOString().split("T")[0],
          nama_cabang: item.nama_cabang,
          total_request: item.total_request,
        });
      });

      // Mengatur format header
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" },
      };

      // Mengatur alignment dan border
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

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LaporanTransaksi.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error in Export Transaksi to Excel:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default exportTransaksiController;
