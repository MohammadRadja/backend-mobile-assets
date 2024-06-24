import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();

export const generateToken = (user) => {
  let userId;
  let username;
  let role;
  if (user.id_admin) {
    userId = user.id_admin;
    username = user.username;
    role = user.jabatan; // Menyertakan role dari jabatan_admin
  } else if (user.id_pegawai) {
    userId = user.id_pegawai;
    username = user.nama_pegawai;
    role = user.jabatan; // Menyertakan role dari jabatan_pegawai
  } else if (user.id_pemilik) {
    userId = user.id_pemilik;
    username = user.nama_pemilik;
    role = user.jabatan; // Menyertakan role dari jabatan_pemilik
  }

  return jwt.sign(
    {
      id: userId,
      username: username,
      role: role, // Menambahkan role ke payload JWT
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h", // 3 hours
    }
  );
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Bearer token is required");
    return res
      .status(401)
      .json({ success: false, message: "Bearer token is required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    let user;
    let role;
    if (decoded.role === "admin") {
      user = await prisma.admin.findFirst({
        where: { username: decoded.username },
      });
      role = "admin";
    } else if (decoded.role === "pegawai") {
      user = await prisma.pegawai.findFirst({
        where: { nama_pegawai: decoded.username },
      });
      role = "pegawai";
    } else if (decoded.role === "pemilik") {
      user = await prisma.pemilik.findFirst({
        where: { nama_pemilik: decoded.username },
      });
      role = "pemilik";
    }

    if (!user) {
      console.error(
        `No user found for role: ${decoded.role} with username: ${decoded.username}`
      );
      return res
        .status(403)
        .json({ success: false, message: "Invalid user role" });
    }

    req.user = { ...user, role: decoded.role };
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    return res.status(403).json({ success: false, message: "Token invalid" });
  }
};
/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const user = req.user;

  // Pastikan req.user dan req.user.role tidak undefined atau null
  if (!user || !user.role) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  console.log("User role in isAdmin:", user.role); // Logging role

  if (user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Admin Access Only. User is not authorized as admin.",
    });
  }

  // Jika semua validasi berhasil, lanjutkan ke middleware atau handler berikutnya
  next();
};

/* 
Pegawai
*/
export const isEmployee = (req, res, next) => {
  const user = req.user;

  // Pastikan req.user dan req.user.role tidak undefined atau null
  if (!user || !user.role) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  console.log("User role in isEmployee:", user.role); // Logging role

  if (user.role !== "pegawai") {
    return res.status(401).json({
      success: false,
      message: "Pegawai Access Only. User is not authorized as Pegawai.",
    });
  }

  // Jika semua validasi berhasil, lanjutkan ke middleware atau handler berikutnya
  next();
};

/* 
Pemilik
*/
export const isOwner = (req, res, next) => {
  const user = req.user;

  // Pastikan req.user dan req.user.role tidak undefined atau null
  if (!user || !user.role) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  console.log("User role in isOwner:", user.role); // Logging role

  if (user.role !== "pemilik") {
    return res.status(401).json({
      success: false,
      message: "Pemilik Access Only. User is not authorized as Pemilik.",
    });
  }

  // Jika semua validasi berhasil, lanjutkan ke middleware atau handler berikutnya
  next();
};
