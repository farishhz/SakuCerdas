import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const app = express();
const port = 8000;
const host = 'localhost';

app.use(cors({ origin: '*' }));
app.use(express.json()); 

const mongoURI = 'mongodb+srv://db_sakucerdas:SakuCerdas67*@clustersakucerdas.makxqp2.mongodb.net/sakucerdas_db?appName=ClusterSakuCerdas';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.post('/auth/google', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name,
        email: email,
        photoURL: photoURL,
        authProvider: 'google' 
      });
      await user.save();
      console.log(' User baru berhasil didaftarkan via Google!');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'RAHASIA_NEGARA_123', { expiresIn: '1d' });

    res.status(200).json({
      message: 'Berhasil login dengan Google!',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});


app.listen(port, host, () => {
  console.log(`Server SakuCerdas berjalan di http://${host}:${port}`);
});