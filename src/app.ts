import express from 'express';
import convidadoRoutes from './routes/convidado.routes';

const app = express();
const port = 3000;
app.use(express.json());

app.use('/convidados', convidadoRoutes)

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})