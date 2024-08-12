import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./prisma/routes/authRoutes/authRoute.js";
import manajerRoute from "./prisma/routes/DataUserRoutes/manajerRoute.js";
import pegawaiRoute from "./prisma/routes/DataUserRoutes/pegawaiRoute.js";
import petugasRoute from "./prisma/routes/DataUserRoutes/petugasRoute.js";
import barangRoute from "./prisma/routes/barangRoute.js";
import cabangRoute from "./prisma/routes/cabangRoute.js";
import detailRequestRoute from "./prisma/routes/detailRequestRoute.js";
import requestRoute from "./prisma/routes/requestRoute.js";
import satuanBarangRoute from "./prisma/routes/satuanbarangRoute.js";
import transaksiRoute from "./prisma/routes/transaksiRoute.js";
import approvalRequestRoute from "./prisma/routes/approvalRequestRoute.js";
import exportDetailRequestRoute from "./prisma/routes/exportRoutes/exportDetailRequestRoute.js";
import exportTransaksiRoute from "./prisma/routes/exportRoutes/exportTransaksiRoute.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Menentukan port default jika tidak ada di .env

// Middleware CORS
const corsOptions = {
  origin: "*", // Ganti dengan asal frontend Anda jika diperlukan
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware logging
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Use routes
app.use("/", authRoute);
app.use("/", manajerRoute);
app.use("/", pegawaiRoute);
app.use("/", petugasRoute);
app.use("/", barangRoute);
app.use("/", cabangRoute);
app.use("/", detailRequestRoute);
app.use("/", requestRoute);
app.use("/", satuanBarangRoute);
app.use("/", transaksiRoute);
app.use("/", approvalRequestRoute);
app.use("/", exportDetailRequestRoute);
app.use("/", exportTransaksiRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
