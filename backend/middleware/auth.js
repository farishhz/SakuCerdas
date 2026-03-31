import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, kamu belum login!' });
  }

  try {
    const verified = jwt.verify(token, 'RAHASIA_JOMOK_67'); 
    
    req.user = verified; 
    next(); 
  } catch (error) {
    res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa!' });
  }
};