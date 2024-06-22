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

    console.log(`User found: ${JSON.stringify(user)}`);

    if (!user) {
      console.log(
        `No user found for role: ${decoded.role} with username: ${decoded.username}`
      );
      return res
        .status(403)
        .json({ success: false, message: "Invalid user role" });
    }

    req.user = { ...user, role };
    console.log("Authenticated user:", req.user);
    next();
  });
};

/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const user = req.user;
  console.log("User role in isAdmin:", user.role); // Logging role
  if (user.role !== "admin") {
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
  const user = req.user;
  console.log("User role in isEmployee:", user.role); // Logging role
  if (user.role !== "pegawai") {
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
  const user = req.user;
  console.log("User role in isOwner:", user.role); // Logging role
  if (user.role !== "pemilik") {
    return res
      .status(401)
      .json({ success: false, message: "Pemilik Access Only" });
  }
  next();
};
