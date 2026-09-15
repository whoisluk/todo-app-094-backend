import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Backend Todo Praktikum Berjalan Mulus!' });
});

app.use('/api', apiRoutes);

export default app;