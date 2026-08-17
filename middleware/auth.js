const jwt = require("jsonwebtoken");

// Define the authentication middleware function
const authenticateUser = (req, res, next) => {
  console.log("-------------------------");
  console.log(req.path);
  console.log("-------------------------");
  if (
    req.path === "/users/login" ||
    req.path === "/users/getyear" ||
    req.path === "/fetch" ||
    req.path === "/fetchAllpaths" ||
    req.path === "/upload-photo" ||
    req.path === "/upload-photo-compress" ||
    req.path.startsWith("/s/") ||
    req.path === "/delete-file" ||
    req.path.includes("/panAndAdharApi/digilocker/callback/") || 
    req.path.includes("/quotation/streamRecording/") || 
    req.path.includes("/quotation/callWebhook") || 
    req.path.startsWith("/scheduler/run")
  ) {
    return next();
  }
  const token = req.headers.authorization;

  // if (!token) {
  //   return res.status(401).json({ message: "Authentication token missing" });
  // }
  const compCode = req.headers.compcode || req.query.compcode || req.body.compcode;
  if (!compCode) {
    return res.status(401).send({ message: "comapany code missing" });
  }
  // jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: "Invalid token" });
  //   }else{
  //     next();
  //   }
  // });
    next();
};
const authenticateUser2 = (req, res, next) => {
  console.log("-------------------------");
  console.log(req.path);
  console.log("-------------------------");
  if (
    req.path?.toLowerCase() === "/finduser" ||
    req.path?.toLowerCase() === "/normalotp"
  ) {
    console.log(req.path);
    return next();
  }
  const token = req.headers.authorization111;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }
  const compCode = req.headers.compcode || req.query.compcode || req.body.compcode;
  if (!compCode) {
    return res.status(401).send({ message: "comapany code missing" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      next();
    }
  });
  // next();
};

// Use the authentication middleware with Express.js for all routes except /login

module.exports = { authenticateUser, authenticateUser2 };
