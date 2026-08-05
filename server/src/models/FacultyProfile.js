import mongoose from 'mongoose';

const facultyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      default: 'Assistant Professor',
    },
    department: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      default: '',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    qualifications: [String],
    salary: {
      type: Number,
      default: 65000,
    },
    leaveBalance: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      earned: { type: Number, default: 15 },
    },
  },
  {
    timestamps: true,
  }
);

const FacultyProfile = mongoose.model('FacultyProfile', facultyProfileSchema);

export default FacultyProfile;
