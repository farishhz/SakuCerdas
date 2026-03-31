import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  photoURL: { type: String, required: false }, 
  authProvider: { type: String, default: 'local' } 
}, { timestamps: true });

export default mongoose.model('User', userSchema);