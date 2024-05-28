import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PegawaiRegister = async (req, res) => {
  const { nama_pegawai, password, jabatan, alamat, no_telp } = req.body;

  if (!nama_pegawai || !password || !jabatan || !alamat || !no_telp) {
    res.status(400).json({
      success: false,
      message: "nama, password, jabatan, alamat and no_telp are required",
    });
    return;
  }
  const existUsername = await prisma.pegawai.findFirst({
    where: {
      nama_pegawai: nama_pegawai,
    },
  });
  if (existUsername) {
    res.status(400).json({
      success: false,
      message: "nama already exist",
    });
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.pegawai.create({
      data: {
        nama_pegawai,
        password: hash,
        jabatan,
        alamat,
        no_telp,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        nama_pegawai: pegawai.nama_pegawai,
        jabatan: pegawai.jabatan,
        alamat: pegawai.alamat,
        no_telp: pegawai.no_telp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const PegawaiLogin = async (req, res) => {
  const { nama_pegawai, password } = req.body;

  if (!nama_pegawai || !password) {
    res.status(400).json({
      success: false,
      message: "nama and password are required",
    });
    return;
  }

  const pegawai = await prisma.pegawai.findFirst({
    where: {
      nama_pegawai: nama_pegawai,
    },
  });

  if (!pegawai) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, pegawai.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const token = generateToken(pegawai);
  res.status(200).json({
    success: true,
    data: {
      pegawai: {
        nama_pegawai: pegawai.nama_pegawai,
        jabatan: pegawai.jabatan,
        alamat: pegawai.alamat,
        no_telp: pegawai.no_telp,
      },

      token,
      expiresIn: "10800",
    },
  });
};

export default { PegawaiRegister, PegawaiLogin };
