import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    examType: {
      type: String,
      enum: ['Internal', 'MidSem', 'EndSem', 'Assignment', 'Practical'],
      default: 'Internal',
    },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    maxMarks: { type: Number, required: true, default: 100 },
    examDate: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
