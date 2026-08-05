import mongoose from 'mongoose';

const feeTransactionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      default: () => `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
    },
    transactionId: {
      type: String,
      default: () => `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    },
    amount: {
      type: Number,
      required: [true, 'Please add a transaction amount'],
    },
    paymentMethod: {
      type: String,
      default: 'Online UPI',
    },
    feeCategory: {
      type: String,
      default: 'Tuition Fee Installment',
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'success',
    },
    remarks: {
      type: String,
      default: 'Fee payment receipt generated',
    },
  },
  {
    timestamps: true,
  }
);

const FeeTransaction = mongoose.model('FeeTransaction', feeTransactionSchema);

export default FeeTransaction;
