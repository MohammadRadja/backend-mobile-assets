const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token is required.");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send("Invalid token.");
    req.user = decoded;
    next();
  });
};

// Middleware for Role verification
const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).send("Access denied.");
  next();
};

// Admin Routes
app.post("/admin", verifyToken, verifyRole(["admin"]), async (req, res) => {
  const { username, password, nama } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { username, password: hashedPassword, nama },
  });
  res.json(admin);
});

app.get("/admin", verifyToken, verifyRole(["admin"]), async (req, res) => {
  const admins = await prisma.admin.findMany();
  res.json(admins);
});

app.put("/admin/:id", verifyToken, verifyRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { username, password, nama } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.update({
    where: { id_admin: parseInt(id) },
    data: { username, password: hashedPassword, nama },
  });
  res.json(admin);
});

app.delete(
  "/admin/:id",
  verifyToken,
  verifyRole(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    await prisma.admin.delete({ where: { id_admin: parseInt(id) } });
    res.send("Admin deleted.");
  }
);

// Pegawai Routes
app.post(
  "/pegawai",
  verifyToken,
  verifyRole(["admin", "pegawai"]),
  async (req, res) => {
    const { nama_pegawai, jabatan, alamat, no_telp } = req.body;
    const pegawai = await prisma.pegawai.create({
      data: { nama_pegawai, jabatan, alamat, no_telp },
    });
    res.json(pegawai);
  }
);

app.get(
  "/pegawai",
  verifyToken,
  verifyRole(["admin", "pegawai"]),
  async (req, res) => {
    const pegawai = await prisma.pegawai.findMany();
    res.json(pegawai);
  }
);

app.put(
  "/pegawai/:id",
  verifyToken,
  verifyRole(["admin", "pegawai"]),
  async (req, res) => {
    const { id } = req.params;
    const { nama_pegawai, jabatan, alamat, no_telp } = req.body;
    const pegawai = await prisma.pegawai.update({
      where: { id_pegawai: parseInt(id) },
      data: { nama_pegawai, jabatan, alamat, no_telp },
    });
    res.json(pegawai);
  }
);

app.delete(
  "/pegawai/:id",
  verifyToken,
  verifyRole(["admin", "pegawai"]),
  async (req, res) => {
    const { id } = req.params;
    await prisma.pegawai.delete({ where: { id_pegawai: parseInt(id) } });
    res.send("Pegawai deleted.");
  }
);

// Pemilik Routes
app.post("/pemilik", async (req, res) => {
  const { nama_pemilik, alamat, no_telp } = req.body;
  const pemilik = await prisma.pemilik.create({
    data: { nama_pemilik, alamat, no_telp },
  });
  res.json(pemilik);
});

app.get(
  "/pemilik",
  verifyToken,
  verifyRole(["admin", "pegawai", "pemilik"]),
  async (req, res) => {
    const pemilik = await prisma.pemilik.findMany();
    res.json(pemilik);
  }
);

// Additional routes for Hewan, Obat, Rekam Medis, Pembayaran, Resep ...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
