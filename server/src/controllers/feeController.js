import Student from '../models/Student.js';
import User from '../models/User.js';
import FeeTransaction from '../models/FeeTransaction.js';

// @desc    Get all student fees (for Accountant / Admin)
// @route   GET /api/fees/students
// @access  Private (accountant, accounts, admin, super_admin)
export const getAllStudentFees = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email profilePic isActive')
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current student's fee summary & payment transactions
// @route   GET /api/fees/my-fees
// @access  Private (student, parent, accountant, admin, super_admin)
export const getMyFees = async (req, res) => {
  try {
    let studentUser = req.user.id;
    
    // If query contains studentUserId (e.g. accountant inspecting a specific student)
    if (req.query.studentUserId && (req.user.role === 'accountant' || req.user.role === 'accounts' || req.user.role === 'admin' || req.user.role === 'super_admin')) {
      studentUser = req.query.studentUserId;
    }

    let studentProfile = await Student.findOne({ user: studentUser }).populate('user', 'name email profilePic');

    // Fallback: If logged in user is admin/accountant/super_admin or student record is missing, fetch first student record for preview
    if (!studentProfile) {
      studentProfile = await Student.findOne().populate('user', 'name email profilePic');
    }

    if (!studentProfile) {
      return res.status(200).json({
        student: {
          rollNumber: 'STU20260001',
          department: 'Computer Science & Engineering',
          batch: '2023-2027',
          semester: 5,
          totalFee: 50000,
          paidFee: 38500,
          discount: 2000,
          dues: 9500,
          feeCategory: 'B.Tech Computer Science Tuition',
          feeStatus: 'Partial',
          dueDate: new Date('2026-08-30'),
          breakdown: {
            tuitionFee: 35000,
            developmentFee: 5000,
            libraryFee: 2500,
            examFee: 2500,
            hostelFee: 5000,
          },
          user: { name: req.user.name || 'Demo Student', email: req.user.email || 'student@erp.com' }
        },
        transactions: [],
      });
    }

    const transactions = await FeeTransaction.find({
      student: studentProfile.user?._id || studentProfile.user,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      student: studentProfile,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee details for a student (Accountant side edit)
// @route   PUT /api/fees/students/:id
// @access  Private (accountant, accounts, admin, super_admin)
export const updateStudentFees = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      totalFee,
      paidFee,
      discount,
      feeCategory,
      dueDate,
      breakdown,
    } = req.body;

    let student = await Student.findById(id);
    if (!student) {
      student = await Student.findOne({ user: id });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const newTotalFee = totalFee !== undefined ? Number(totalFee) : student.totalFee;
    const newPaidFee = paidFee !== undefined ? Number(paidFee) : student.paidFee;
    const newDiscount = discount !== undefined ? Number(discount) : student.discount;
    const newDues = Math.max(0, newTotalFee - newDiscount - newPaidFee);

    let calculatedStatus = 'Pending';
    if (newDues <= 0) {
      calculatedStatus = 'Paid';
    } else if (newPaidFee > 0) {
      calculatedStatus = 'Partial';
    }

    student.totalFee = newTotalFee;
    student.paidFee = newPaidFee;
    student.discount = newDiscount;
    student.dues = newDues;
    student.feeStatus = calculatedStatus;

    if (feeCategory) student.feeCategory = feeCategory;
    if (dueDate) student.dueDate = new Date(dueDate);

    if (breakdown) {
      student.breakdown = {
        ...student.breakdown,
        ...breakdown,
      };
    }

    await student.save();

    const updatedStudent = await Student.findById(student._id).populate('user', 'name email profilePic');

    res.status(200).json({
      message: 'Student fee structure updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a fee payment for a student
// @route   POST /api/fees/pay
// @access  Private
export const recordFeePayment = async (req, res) => {
  try {
    const { studentId, amount, paymentMethod, feeCategory, remarks } = req.body;

    let targetStudentId = studentId;
    if (!targetStudentId && req.user.role === 'student') {
      targetStudentId = req.user.id;
    }

    let student = await Student.findOne({ user: targetStudentId });
    if (!student) {
      student = await Student.findById(targetStudentId);
    }
    if (!student) {
      student = await Student.findOne();
    }

    if (!student) {
      return res.status(404).json({ message: 'Student record not found for payment' });
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid payment amount' });
    }

    // Create FeeTransaction
    const transaction = await FeeTransaction.create({
      student: student.user,
      amount: payAmount,
      paymentMethod: paymentMethod || 'Online UPI',
      feeCategory: feeCategory || student.feeCategory || 'Tuition Fee Installment',
      status: 'success',
      remarks: remarks || 'Fee payment recorded via Portal',
    });

    // Update Student paidFee and dues
    student.paidFee += payAmount;
    student.dues = Math.max(0, student.totalFee - student.discount - student.paidFee);

    if (student.dues <= 0) {
      student.feeStatus = 'Paid';
    } else if (student.paidFee > 0) {
      student.feeStatus = 'Partial';
    }

    await student.save();

    const updatedStudent = await Student.findById(student._id).populate('user', 'name email profilePic');

    res.status(201).json({
      message: 'Payment recorded successfully',
      transaction,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fee transactions (for Accountant / Admin)
// @route   GET /api/fees/transactions
// @access  Private (accountant, accounts, admin, super_admin)
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await FeeTransaction.find()
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
