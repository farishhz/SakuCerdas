import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';

// imporrt routes
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors()); 
app.use(express.json());

// pasang routes
app.use('/api', apiRoutes);

// open server
app.listen(port, () => {
  console.log(`backend SakuCerdas berjalan di http://localhost:${port}`);
});