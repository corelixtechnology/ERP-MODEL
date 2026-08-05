import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllStudentFees,
  getMyFees,
  updateStudentFees,
  recordFeePayment,
  getAllTransactions,
} from '../controllers/feeController.js';

const router = express.Router();

router.use(protect);

router.get('/my-fees', getMyFees);
router.post('/pay', recordFeePayment);

router.get(
  '/students',
  authorize('accountant', 'accounts', 'admin', 'super_admin'),
  getAllStudentFees
);

router.put(
  '/students/:id',
  authorize('accountant', 'accounts', 'admin', 'super_admin'),
  updateStudentFees
);

router.get(
  '/transactions',
  authorize('accountant', 'accounts', 'admin', 'super_admin'),
  getAllTransactions
);

export default router;
