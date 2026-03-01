import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    try {
 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({ success: false, message: "Your account has been blocked by admin" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token not found" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default protect;
