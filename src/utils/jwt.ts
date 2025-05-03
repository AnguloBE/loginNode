import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_key';

export const signToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};