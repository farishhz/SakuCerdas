import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Target', 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true 
  },
  type: {
    type: String,
    default: 'saving' 
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);