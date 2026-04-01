import express from 'express';
import path from 'path';
import convidadoRoutes from './routes/convidado.routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../frontend')));
app.use('/convidados', convidadoRoutes);
app.get('/', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
});
