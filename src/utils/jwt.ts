import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_key';

export const signToken = (id: number): string => {
    return jwt.sign({id}, SECRET_KEY, { expiresIn: '30d' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};