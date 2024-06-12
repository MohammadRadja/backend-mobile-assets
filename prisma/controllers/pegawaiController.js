import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PegawaiRegister = async (req, res) => {
  const { username, password, jabatan, alamat, no_telp } = req.body;

  if (!username || !password || !jabatan || !alamat || !no_telp) {
    res.status(400).json({
      success: false,
      message: "username, password, jabatan, alamat and no_telp are required",
    });
    return;
  }
  const existUsername = await prisma.pegawai.findFirst({
    where: {
      username: username,
    },
  });
  if (existUsername) {
    res.status(400).json({
      success: false,
      message: "username already exist",
    });
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.pegawai.create({
      data: {
        username,
        password: hash,
        jabatan,
        alamat,
        no_telp,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        username: pegawai.username,
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
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "username and password are required",
    });
    return;
  }

  const pegawai = await prisma.pegawai.findFirst({
    where: {
      username: username,
    },
  });

  if (!pegawai) {
    res.status(401).json({
      success: false,
      message: "username or password is incorrect",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, pegawai.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "username or password is incorrect",
    });
    return;
  }

  const token = generateToken(pegawai);
  res.status(200).json({
    success: true,
    data: {
      role: "pegawai",
      pegawai: {
        username: pegawai.username,
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
