import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function seed() {
  const pegawai1 = await bcrypt.hash("Chiko123", 10);
  const pegawai2 = await bcrypt.hash("Zidan123", 10);
  const petugas = await bcrypt.hash("Maul123", 10);
  const manajer = await bcrypt.hash("Radja123", 10);

  // Seed data untuk tabel User
  await prisma.user.createMany({
    data: [
      {
        id_user: uuidv4(),
        username: "Radja",
        password: manajer,
        jabatan: "manajer",
      },
      {
        id_user: uuidv4(),
        username: "Maul",
        password: petugas,
        jabatan: "petugas",
      },
      {
        id_user: uuidv4(),
        username: "Zidan",
        password: pegawai1,
        jabatan: "pegawai",
      },
      {
        id_user: uuidv4(),
        username: "Chiko",
        password: pegawai2,
        jabatan: "pegawai",
      },
    ],
  });

  // Seed data untuk tabel Cabang
  await prisma.cabang.createMany({
    data: [
      {
        kode_cabang: uuidv4(),
        nama_cabang: "Cabang A",
        alamat_cabang: "Alamat Cabang A",
        notelp_cabang: "08123456789",
        keterangan: "Keterangan Cabang A",
      },
      {
        kode_cabang: uuidv4(),
        nama_cabang: "Cabang B",
        alamat_cabang: "Alamat Cabang B",
        notelp_cabang: "08123456780",
        keterangan: "Keterangan Cabang B",
      },
      {
        kode_cabang: uuidv4(),
        nama_cabang: "Cabang C",
        alamat_cabang: "Alamat Cabang C",
        notelp_cabang: "08123456781",
        keterangan: "Keterangan Cabang C",
      },
      {
        kode_cabang: uuidv4(),
        nama_cabang: "Cabang D",
        alamat_cabang: "Alamat Cabang D",
        notelp_cabang: "08123456782",
        keterangan: "Keterangan Cabang D",
      },
      {
        kode_cabang: uuidv4(),
        nama_cabang: "Cabang E",
        alamat_cabang: "Alamat Cabang E",
        notelp_cabang: "08123456783",
        keterangan: "Keterangan Cabang E",
      },
    ],
  });

  // Seed data untuk tabel Satuan
  await prisma.satuan_barang.createMany({
    data: [
      { id_satuan: uuidv4(), nama_satuan: "Unit" },
      { id_satuan: uuidv4(), nama_satuan: "Box" },
      { id_satuan: uuidv4(), nama_satuan: "Pack" },
      { id_satuan: uuidv4(), nama_satuan: "Lembar" },
      { id_satuan: uuidv4(), nama_satuan: "Kilogram" },
    ],
  });

  // Ambil data cabang dan barang untuk digunakan di request
  const cabangs = await prisma.cabang.findMany();
  const barangs = await prisma.barang.findMany();
  const users = await prisma.user.findMany();
  const satuans = await prisma.satuan_barang.findMany();

  // Seed data untuk tabel Barang
  await prisma.barang.createMany({
    data: [
      {
        id_barang: uuidv4(),
        nama_barang: "Barang A",
        jenis_barang: "Jenis A",
        id_satuan: satuans[0].id_satuan, // Menggunakan ID satuan dari hasil query
        harga: 10000,
        stok_awal: 100,
        terpakai: 0,
        sisa: 100,
      },
      {
        id_barang: uuidv4(),
        nama_barang: "Barang B",
        jenis_barang: "Jenis B",
        id_satuan: satuans[1].id_satuan, // Menggunakan ID satuan dari hasil query
        harga: 20000,
        stok_awal: 50,
        terpakai: 0,
        sisa: 50,
      },
      {
        id_barang: uuidv4(),
        nama_barang: "Barang C",
        jenis_barang: "Jenis C",
        id_satuan: satuans[0].id_satuan, // Menggunakan ID satuan dari hasil query
        harga: 15000,
        stok_awal: 75,
        terpakai: 0,
        sisa: 75,
      },
      {
        id_barang: uuidv4(),
        nama_barang: "Barang D",
        jenis_barang: "Jenis D",
        id_satuan: satuans[1].id_satuan,
        harga: 25000,
        stok_awal: 30,
        terpakai: 0,
        sisa: 30,
      },
      {
        id_barang: uuidv4(),
        nama_barang: "Barang E",
        jenis_barang: "Jenis E",
        id_satuan: satuans[0].id_satuan,
        harga: 30000,
        stok_awal: 20,
        terpakai: 0,
        sisa: 20,
      },
    ],
  });

  // Seed data untuk tabel Request
  await prisma.request.createMany({
    data: [
      {
        kode_request: "REQ24080001",
        tanggal_request: new Date(),
        kode_cabang: cabangs[0].kode_cabang,
        id_user: users[0].id_user,
        id_barang: barangs[0].id_barang,
        department: "IT",
        jumlah_barang: 10,
        keperluan: "Kebutuhan IT",
        status: "Pending",
      },
      {
        kode_request: "REQ24080002",
        tanggal_request: new Date(),
        kode_cabang: cabangs[1].kode_cabang,
        id_user: users[1].id_user,
        id_barang: barangs[1].id_barang,
        department: "HRD",
        jumlah_barang: 5,
        keperluan: "Kebutuhan HRD",
        status: "Approved",
      },
      {
        kode_request: "REQ24080003",
        tanggal_request: new Date(),
        kode_cabang: cabangs[2].kode_cabang,
        id_user: users[2].id_user,
        id_barang: barangs[2].id_barang,
        department: "Finance",
        jumlah_barang: 8,
        keperluan: "Kebutuhan Finance",
        status: "Pending",
      },
      {
        kode_request: "REQ24080004",
        tanggal_request: new Date(),
        kode_cabang: cabangs[3].kode_cabang,
        id_user: users[3].id_user,
        id_barang: barangs[3].id_barang,
        department: "Marketing",
        jumlah_barang: 3,
        keperluan: "Kebutuhan Marketing",
        status: "Pending",
      },
      {
        kode_request: "REQ24080005",
        tanggal_request: new Date(),
        kode_cabang: cabangs[4].kode_cabang,
        id_user: users[0].id_user,
        id_barang: barangs[4].id_barang,
        department: "Logistics",
        jumlah_barang: 12,
        keperluan: "Kebutuhan Logistics",
        status: "Pending",
      },
    ],
  });

  console.log("Seeding Data Master Selesai");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
