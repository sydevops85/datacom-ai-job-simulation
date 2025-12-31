import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.message === 'Not authenticated') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (err.message === 'Insufficient permissions') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
