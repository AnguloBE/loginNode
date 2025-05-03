import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombres, apellidos, telefono, password, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (nombres, apellidos, telefono, password_hash, rol) VALUES ($1, $2, $3, $4, $5)',
      [nombres, apellidos, telefono, hashedPassword, rol]
    );
    res.status(201).send('Usuario registrado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registrando usuario');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { telefono, password } = req.body;
  try {
    const result = await pool.query('SELECT id_usuario, password_hash, rol FROM usuarios WHERE telefono = $1', [telefono]);

    if(result.rows.length === 0) {
      res.status(400).json({ succes: false, message: 'telefono no encontrado'});
      return;
    }

    const { id_usuario, password_hash, rol } = result.rows[0];

    const validPassword = await bcrypt.compare(password, password_hash);
    if (!validPassword) {
      res.status(400).send('Contraseña incorrecta');
      return;
    }

    const token = signToken( id_usuario );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en login');
  }
};

/*
export const getPersonas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT id, username, password, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error obteniendo personas');
  }
};*/
