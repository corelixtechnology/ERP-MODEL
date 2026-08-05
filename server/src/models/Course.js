import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Please add a course code'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Please add credit hours'],
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Please add a semester'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign a faculty member'],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
