import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0 
  },
  status: {
    type: String,
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Target', targetSchema);