import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import Target from '../models/Target.js';
import { verifyToken } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

const app = express();
const port = 8000;
const host = 'localhost';

app.use(cors({ origin: '*' }));
app.use(express.json()); 

const mongoURI = 'mongodb+srv://db_sakucerdas:SakuCerdas67*@clustersakucerdas.makxqp2.mongodb.net/sakucerdas_db?appName=ClusterSakuCerdas';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Endpoint Login

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan. Silakan daftar dulu!' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ 
        message: 'Akun ini terdaftar lewat Google. Silakan klik tombol "Masuk dengan Google".' 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Kata sandi yang kamu masukkan salah!' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      'RAHASIA_NEGARA_123', 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Berhasil login!',
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

// Endpoint Register

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Acak password pakai bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// Endpoint Google

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

    const token = jwt.sign({ id: user._id, email: user.email }, 'RAHASIA_JOMOK_67', { expiresIn: '1d' });

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

// Endpoint Target Impian

app.post('/targets', verifyToken, async (req, res) => {
  try {
    const { title, targetAmount } = req.body;

    const newTarget = new Target({
      userId: req.user.id, 
      title: title,
      targetAmount: targetAmount
    });

    await newTarget.save();
    res.status(201).json({ 
      status: 'success', 
      message: 'Target impian berhasil dibuat!', 
      data: newTarget 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

app.get('/targets', verifyToken, async (req, res) => {
  try {
    const targets = await Target.find({ userId: req.user.id });
    
    res.status(200).json({ 
      status: 'success', 
      data: targets 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// Endpoint Menabung

app.post('/transactions', verifyToken, async (req, res) => {
  try {
    const { targetId, amount, description } = req.body;

    const target = await Target.findOne({ _id: targetId, userId: req.user.id });
    
    if (!target) {
      return res.status(404).json({ message: 'Target impian tidak ditemukan!' });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      targetId: targetId,
      amount: amount,
      description: description
    });
    await newTransaction.save();

    target.currentAmount += amount;

    if (target.currentAmount >= target.targetAmount) {
      target.status = 'completed';
    }
    
    await target.save(); 

    res.status(201).json({ 
      status: 'success', 
      message: 'Berhasil menabung!', 
      transaction: newTransaction,
      updatedTarget: target
    });

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

app.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      status: 'success', 
      data: transactions 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// Endpoint Budget

app.post('/budgets', verifyToken, async (req, res) => {
  try {
    const { category, limitAmount } = req.body;

    const existingBudget = await Budget.findOne({ userId: req.user.id, category: category });
    if (existingBudget) {
      return res.status(400).json({ message: `Budget untuk kategori ${category} sudah ada!` });
    }

    const newBudget = new Budget({
      userId: req.user.id,
      category: category,
      limitAmount: limitAmount
    });

    await newBudget.save();
    res.status(201).json({ 
      status: 'success', 
      message: 'Kategori budget berhasil dibuat!', 
      data: newBudget 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

app.get('/budgets', verifyToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    
    res.status(200).json({ 
      status: 'success', 
      data: budgets 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// Jalankan server

app.listen(port, host, () => {
  console.log(`Server SakuCerdas berjalan di http://${host}:${port}`);
});