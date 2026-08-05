import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSystemSettings,
  updateSystemSettings,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes and restrict them to 'admin' and 'super_admin' roles
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/dashboard', getDashboardStats);

router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/courses')
  .get(getAllCourses)
  .post(createCourse);

router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse);

router.route('/settings')
  .get(getSystemSettings)
  .put(updateSystemSettings);

export default router;
