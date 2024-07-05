import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AdminRegister = async (req, res) => {
  const { nama, username, password, jabatan } = req.body;

  if (!nama || !username || !password || !jabatan) {
    return res.status(400).json({
      success: false,
      message: "Name, username, and password are required",
    });
  }

  try {
    const existUsername = await prisma.admin.findFirst({
      where: {
        username,
      },
    });

    if (existUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.admin.create({
      data: {
        nama,
        username,
        password: hash,
        jabatan,
      },
    });

    console.log(`Admin registered successfully: ${user.username}`);

    return res.status(201).json({
      success: true,
      data: {
        nama: user.nama,
        username: user.username,
        jabatan: user.jabatan,
      },
    });
  } catch (error) {
    console.error("Error in admin registration:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const AdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const token = generateToken(admin);

    console.log(`Admin logged in successfully: ${admin.username}`);

    return res.status(200).json({
      success: true,
      data: {
        role: "admin",
        user: {
          nama: admin.nama,
          username: admin.username,
          jabatan: admin.jabatan,
        },
        token,
        expiresIn: "10800",
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default { AdminRegister, AdminLogin };
