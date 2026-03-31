import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  limitAmount: {
    type: Number,
    required: true
  },
  spentAmount: {
    type: Number,
    default: 0 
  }
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);