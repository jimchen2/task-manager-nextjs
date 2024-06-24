// middleware/authMiddleware.js

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export function authMiddleware(handler) {
  return async (req, res) => {
    const { cookies } = req;
    const authToken = cookies.authToken;

    // Use the PASSWORD from environment variables
    if (authToken !== process.env.PASSWORD) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    return handler(req, res);
  };
}