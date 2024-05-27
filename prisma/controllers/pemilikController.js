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
  const existUsername = await prisma.user.findUnique({
    where: {
      nama_pemilik,
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
    const user = await prisma.user.create({
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
        nama_pegawai: user.nama_pegawai,
        jabatan: user.jabatan,
        alamat: user.alamat,
        no_telp: user.no_telp,
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

  const user = await prisma.user.findUnique({
    where: {
      nama_pemilik,
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "nama or password is incorrect",
    });
    return;
  }

  const token = generateToken(user);
  res.status(200).json({
    success: true,
    data: {
      user: {
        nama_pegawai: user.nama_pegawai,
        jabatan: user.jabatan,
        alamat: user.alamat,
        no_telp: user.no_telp,
      },

      token,
      expiresIn: "10800",
    },
  });
};

export default { PemilikRegister, PemilikLogin };
