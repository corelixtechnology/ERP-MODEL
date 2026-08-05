import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, 'Please add a batch'],
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      default: 1,
    },
    totalFee: {
      type: Number,
      default: 45000,
    },
    paidFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    dues: {
      type: Number,
      default: 45000,
    },
    feeCategory: {
      type: String,
      default: 'General Tuition',
    },
    feeStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    breakdown: {
      tuitionFee: { type: Number, default: 30000 },
      developmentFee: { type: Number, default: 5000 },
      libraryFee: { type: Number, default: 2500 },
      examFee: { type: Number, default: 2500 },
      hostelFee: { type: Number, default: 5000 },
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
