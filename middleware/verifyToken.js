import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export default function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader
    //console.log(token);
  
    if (!token) {
      return res.status(401).json({ err:"Token not found" }); // Unauthorized
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ err:"Token Expired" }); // Forbidden
      }
      req.decoded = decoded;
      next();
    });
  };