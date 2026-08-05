import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDepartments,
  createDepartment,
  getAttendance,
  markAttendance,
  getTimetable,
  getExams,
  getMarks,
  getLibraryBooks,
  createLibraryBook,
  getNotices,
  createNotice,
  getRoleDashboard,
} from '../controllers/erpController.js';

const router = express.Router();

// Require logged in user for all ERP endpoints
router.use(protect);

router.get('/dashboard', getRoleDashboard);

router.route('/departments')
  .get(getDepartments)
  .post(authorize('admin', 'super_admin', 'hod'), createDepartment);

router.route('/attendance')
  .get(getAttendance)
  .post(authorize('admin', 'super_admin', 'faculty', 'hod'), markAttendance);

router.get('/timetable', getTimetable);
router.get('/exams', getExams);
router.get('/marks', getMarks);

router.route('/library')
  .get(getLibraryBooks)
  .post(authorize('admin', 'super_admin', 'librarian'), createLibraryBook);

router.route('/notices')
  .get(getNotices)
  .post(authorize('admin', 'super_admin', 'hod', 'faculty', 'exam_cell', 'placement_officer'), createNotice);

export default router;
