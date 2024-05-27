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
    req.user = user;
    next();
  });
};

/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role != "admin") {
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
  const { role } = req.user;
  if (role != "pegawai") {
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
  const { role } = req.user;
  if (role != "pemilik") {
    return res
      .status(401)
      .json({ success: false, message: "Pemilik Acces Only" });
  }
  next();
};
