import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PemilikRegister = async (req, res) => {
  const { nama_pemilik, password, alamat, no_telp } = req.body;

  if (!nama_pemilik || !password || !alamat || !no_telp) {
    res.status(400).json({
      success: false,
      message: "nama, password, alamat and no_telp are required",
    });
    return;
  }
  const existUsername = await prisma.pemilik.findFirst({
    where: {
      nama_pemilik: nama_pemilik,
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
    const user = await prisma.pemilik.create({
      data: {
        nama_pemilik,
        password: hash,
        alamat,
        no_telp,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        nama_pegawai: pemilik.nama_pegawai,
        jabatan: pemilik.jabatan,
        alamat: pemilik.alamat,
        no_telp: pemilik.no_telp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const PemilikLogin = async (req, res) => {
  const { nama_pemilik, password } = req.body;

  if (!nama_pemilik || !password) {
    res.status(400).json({
      success: false,
      message: "nama and password are required",
    });
    return;
  }

  const pemilik = await prisma.pemilik.findFirst({
    where: {
      nama_pemilik: nama_pemilik,
    },
  });

  if (!pemilik) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, pemilik.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const token = generateToken(pemilik);
  res.status(200).json({
    success: true,
    data: {
      pemilik: {
        nama_pegawai: pemilik.nama_pegawai,
        jabatan: pemilik.jabatan,
        alamat: pemilik.alamat,
        no_telp: pemilik.no_telp,
      },

      token,
      expiresIn: "10800",
    },
  });
};

export default { PemilikRegister, PemilikLogin };
