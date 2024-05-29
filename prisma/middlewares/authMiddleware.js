import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const generateToken = (user) => {
  let userId;
  let username;
  let tableName;

  if (user.id_admin) {
    userId = user.id_admin;
    username = user.username;
    tableName = "admin"; // Sesuaikan dengan format yang digunakan di middleware
  } else if (user.id_pegawai) {
    userId = user.id_pegawai;
    username = user.nama_pegawai;
    tableName = "pegawai"; // Sesuaikan dengan format yang digunakan di middleware
  } else if (user.id_pemilik) {
    userId = user.id_pemilik;
    username = user.nama_pemilik;
    tableName = "pemilik"; // Sesuaikan dengan format yang digunakan di middleware
  }

  return jwt.sign(
    {
      id: userId,
      username: username,
      role: tableName, // Menyertakan peran dalam payload
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 10800, // 3 hours
    }
  );
};

export const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Bearer token is required" });
  }
  const plainToken = token.split(" ")[1];
  jwt.verify(plainToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ success: false, message: "Token invalid" });
    }

    let user;
    if (decoded.role === "admin") {
      user = await prisma.admin.findFirst({
        where: { username: decoded.username },
      });
    } else if (decoded.role === "pegawai") {
      user = await prisma.pegawai.findFirst({
        where: { nama_pegawai: decoded.username },
      });
    } else if (decoded.role === "pemilik") {
      user = await prisma.pemilik.findFirst({
        where: { nama_pemilik: decoded.username },
      });
    }

    if (!user) {
      console.log(
        `No user found for role: ${decoded.role} with username: ${decoded.username}`
      );
      return res
        .status(403)
        .json({ success: false, message: "Invalid user role" });
    }

    req.tableName = decoded.role;
    req.user = user;
    next();
  });
};

/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const tableName = req.tableName; // Mengakses req.tableName untuk mendapatkan nama tabel pengguna
  if (tableName !== "admin") {
    return res
      .status(401)
      .json({ success: false, message: "Admin Access Only" });
  }
  next();
};
/* 
Pegawai
*/
export const isEmployee = (req, res, next) => {
  const tableName = req.tableName; // Mengakses req.tableName untuk mendapatkan nama tabel pengguna
  if (tableName !== "pegawai") {
    return res
      .status(401)
      .json({ success: false, message: "Pegawai Access Only" });
  }
  next();
};
/* 
Pemilik
*/
export const isOwner = (req, res, next) => {
  const tableName = req.tableName; // Mengakses req.tableName untuk mendapatkan nama tabel pengguna
  if (tableName !== "pemilik") {
    return res
      .status(401)
      .json({ success: false, message: "Pemilik Access Only" });
  }
  next();
};
