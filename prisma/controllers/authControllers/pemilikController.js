import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PemilikRegister = async (req, res) => {
  const { username, password, jabatan, alamat, no_telp } = req.body;

  if (!username || !password || !jabatan || !alamat || !no_telp) {
    res.status(400).json({
      success: false,
      message: "username, password, alamat and no_telp are required",
    });
    return;
  }
  const existUsername = await prisma.pemilik.findFirst({
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
    const user = await prisma.pemilik.create({
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
        username: pemilik.username,
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
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    const pemilik = await prisma.pemilik.findFirst({
      where: {
        username: username,
      },
    });

    if (!pemilik) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, pemilik.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const token = generateToken(pemilik);
    return res.status(200).json({
      success: true,
      data: {
        role: "pemilik",
        user: {
          username: pemilik.username,
          jabatan: pemilik.jabatan,
          alamat: pemilik.alamat,
          no_telp: pemilik.no_telp,
        },
        token,
        expiresIn: "10800",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

export default { PemilikRegister, PemilikLogin };
