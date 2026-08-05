import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      default: 'EduERP Institute of Technology',
    },
    sessionYear: {
      type: String,
      required: true,
      default: '2026-2027',
    },
    attendanceThreshold: {
      type: Number,
      required: true,
      default: 75,
    },
  },
  {
    timestamps: true,
  }
);

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
