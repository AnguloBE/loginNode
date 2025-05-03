import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personaRoutes from './routes/personaRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/personas', personaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
