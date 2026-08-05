import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marksObtained: { type: Number, required: true },
    grade: { type: String, default: 'A' },
    remarks: { type: String, default: 'Good' },
  },
  {
    timestamps: true,
  }
);

const Mark = mongoose.model('Mark', markSchema);

export default Mark;
