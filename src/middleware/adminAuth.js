// Middleware to protect routes
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
    let token;
    
    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get admin from token
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin || !admin.isActive) {
          return res.status(401).json({ message: 'Not authorized, account is inactive' });
        }
        req.admin=admin;
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
    
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  };
  
  // Middleware to restrict to super-admin
  export const restrictToSuperAdmin = (req, res, next) => {
    if (req.admin && req.admin.role === 'super-admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized, requires super-admin role' });
    }
  };
  