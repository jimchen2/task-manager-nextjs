// middleware/authMiddleware.js

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export function authMiddleware(handler) {
  return async (req, res) => {
    const { cookies } = req;
    const authToken = cookies.authToken;

    // Check if it's a GET request
    if (req.method === 'GET') {
      // For GET requests, allow both admin and view passwords
      if (authToken !== process.env.ADMIN_PASSWORD && authToken !== process.env.VIEW_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
    } else {
      // For non-GET requests, only allow admin password
      if (authToken !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
    }

    return handler(req, res);
  };
}