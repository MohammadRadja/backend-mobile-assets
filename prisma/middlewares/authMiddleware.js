import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 10800,
    }
  );
};

export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Bearer token is required" });
  }
  const plainToken = token.split(" ")[1];
  jwt.verify(plainToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ success: false, message: "Token invalid" });
    }
    // Anda perlu menentukan tabel yang sesuai berdasarkan jenis pengguna
    let tableName;
    switch (user.role) {
      case "admin":
        tableName = "Admin";
        break;
      case "pegawai":
        tableName = "Pegawai";
        break;
      case "pemilik":
        tableName = "Pemilik";
        break;
      default:
        return res
          .status(403)
          .json({ success: false, message: "Invalid user role" });
    }
    // Memasukkan informasi pengguna ke dalam properti req untuk digunakan oleh middleware otorisasi
    req.user = user;
    req.tableName = tableName;
    next();
  });
};

/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const tableName = req.tableName; // Mengakses req.tableName untuk mendapatkan nama tabel pengguna
  if (tableName !== "Admin") {
    return res
      .status(401)
      .json({ success: false, message: "Admin Acces Only" });
  }
  next();
};

/* 
Pegawai
*/
export const isEmployee = (req, res, next) => {
  const tableName = req.tableName; // Mengakses req.tableName untuk mendapatkan nama tabel pengguna
  if (tableName !== "Pemilik") {
    return res
      .status(401)
      .json({ success: false, message: "Pegawai Acces Only" });
  }
  next();
};

/* 
Pemilik
*/
export const isOwner = (req, res, next) => {
  const { role } = req.pemilik;
  if (role != "pemilik") {
    return res
      .status(401)
      .json({ success: false, message: "Pemilik Acces Only" });
  }
  next();
};
