import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    targetRoles: [String], // e.g. ['student', 'faculty', 'all']
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    category: { type: String, default: 'General' },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
