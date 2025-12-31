import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../database/connection';
import { AuthRequest } from '../middleware/auth.middleware';

export async function login(req: AuthRequest, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Query users from database
    const results: any = await executeQuery(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!results || !Array.isArray(results) || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    
    // In production, use bcrypt to compare hashed passwords
    // For demo, password comparison with stored value
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret'
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function logout(req: AuthRequest, res: Response) {
  // Client-side token deletion is handled on the frontend
  res.status(200).json({ message: 'Logged out successfully' });
}
