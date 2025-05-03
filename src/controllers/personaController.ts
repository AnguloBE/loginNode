import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { signToken } from '../utils/jwt';
import { Persona } from '../types/persona';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role]
    );
    res.status(201).send('Usuario registrado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registrando usuario');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const persona: Persona = result.rows[0];
    if (!persona) {
      res.status(400).send('Usuario no encontrado');
      return;
    }

    const validPassword = await bcrypt.compare(password, persona.password);
    if (!validPassword) {
      res.status(400).send('Contraseña incorrecta');
      return;
    }

    const token = signToken({ id: persona.id, username: persona.username });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en login');
  }
};

export const getPersonas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT id, username, password, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error obteniendo personas');
  }
};
