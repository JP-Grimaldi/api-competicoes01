import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes/convidado.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/convidados', router);

// caminho da pasta do front
const frontendPath = path.join(__dirname, '..', 'frontend');

// servir arquivos estáticos
app.use(express.static(frontendPath));

// abrir o index.html quando acessar /
app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});