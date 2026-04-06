import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors()); 
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`backend SakuCerdas berjalan di http://localhost:${port}`);
});