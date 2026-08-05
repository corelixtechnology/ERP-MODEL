import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    department: { type: String, required: true },
    program: { type: String, default: 'B.Tech' },
    semester: { type: Number, required: true },
    section: { type: String, default: 'A' },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    startTime: { type: String, required: true }, // e.g. "09:00 AM"
    endTime: { type: String, required: true },   // e.g. "10:00 AM"
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
