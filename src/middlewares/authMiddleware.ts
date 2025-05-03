import { Request, Response, NextFunction } from 'express';
import { verifyToken, signToken } from '../utils/jwt';

interface DecodedToken {
  id: number;
  username: string;
  exp: number;
}

interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send('Token no proporcionado');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token) as DecodedToken;
    req.user = decoded;

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - now;

    // Si expira en menos de 1 día, renovamos
    if (expiresIn < 5 * 24 * 60 * 60) {
      const newToken = signToken({ id: decoded.id, username: decoded.username });
      res.setHeader('x-new-token', newToken);
    }

    next();
  } catch (error) {
    res.status(401).send('Token inválido o expirado');
  }
};
