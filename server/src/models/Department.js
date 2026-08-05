import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a department code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      trim: true,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    programs: [
      {
        name: { type: String, required: true },
        code: { type: String, required: true },
        durationYears: { type: Number, default: 4 },
        totalSemesters: { type: Number, default: 8 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Department', departmentSchema);

export default Department;
