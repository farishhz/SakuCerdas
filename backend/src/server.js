import express from 'express';
import cors from 'cors';
import routes from '../src/routes.js';

const app = express();
const port = 8000;
const host = 'localhost';

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use('/', routes);

app.listen(port, host, () => {
  console.log(`Server SakuCerdas berjalan di http://${host}:${port}`);
});