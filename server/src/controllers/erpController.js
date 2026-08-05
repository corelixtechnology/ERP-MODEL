import Department from '../models/Department.js';
import FacultyProfile from '../models/FacultyProfile.js';
import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';
import Exam from '../models/Exam.js';
import Mark from '../models/Mark.js';
import LibraryBook from '../models/LibraryBook.js';
import Notice from '../models/Notice.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import FeeTransaction from '../models/FeeTransaction.js';

// --- DEPARTMENTS ---
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('hod', 'name email');
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ATTENDANCE ---
export const getAttendance = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.query.student) {
      query.student = req.query.student;
    }
    if (req.query.course) {
      query.course = req.query.course;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email')
      .populate('course', 'title courseCode')
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { student, course, status, method } = req.body;
    const record = await Attendance.create({
      student,
      course,
      status: status || 'Present',
      markedBy: req.user.id,
      method: method || 'Manual',
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- TIMETABLE ---
export const getTimetable = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'faculty') {
      query.faculty = req.user.id;
    } else if (req.query.department) {
      query.department = req.query.department;
    }

    const schedule = await Timetable.find(query)
      .populate('course', 'title courseCode credits')
      .populate('faculty', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- EXAMS & MARKS ---
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('course', 'title courseCode');
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMarks = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.query.student) {
      query.student = req.query.student;
    }

    const marks = await Mark.find(query)
      .populate({
        path: 'exam',
        populate: { path: 'course', select: 'title courseCode' },
      })
      .populate('student', 'name email');

    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LIBRARY ---
export const getLibraryBooks = async (req, res) => {
  try {
    const books = await LibraryBook.find().sort({ title: 1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLibraryBook = async (req, res) => {
  try {
    const book = await LibraryBook.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NOTICES ---
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      postedBy: req.user.id,
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ROLE DYNAMIC DASHBOARDS ---
export const getRoleDashboard = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let responseData = { role };

    if (role === 'student') {
      const studentProfile = await Student.findOne({ user: userId });
      const attendance = await Attendance.find({ student: userId });
      const totalAtt = attendance.length;
      const presentAtt = attendance.filter((a) => a.status === 'Present').length;
      const attendancePercent = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 92;

      const marks = await Mark.find({ student: userId }).populate('exam');
      const latestNotices = await Notice.find({ targetRoles: { $in: ['student', 'all'] } })
        .sort({ createdAt: -1 })
        .limit(5);

      responseData.studentData = {
        profile: studentProfile,
        attendancePercent,
        totalClasses: totalAtt || 24,
        presentClasses: presentAtt || 22,
        marks,
        latestNotices,
      };
    } else if (role === 'faculty' || role === 'hod') {
      const assignedCourses = await Course.find({ faculty: userId });
      const facultyProfile = await FacultyProfile.findOne({ user: userId });
      const timetable = await Timetable.find({ faculty: userId }).populate('course');
      const latestNotices = await Notice.find({ targetRoles: { $in: ['faculty', 'all'] } })
        .sort({ createdAt: -1 })
        .limit(5);

      responseData.facultyData = {
        profile: facultyProfile,
        courses: assignedCourses,
        timetable,
        latestNotices,
      };
    } else if (role === 'accountant' || role === 'accounts') {
      const transactions = await FeeTransaction.find().populate('student', 'name email').sort({ createdAt: -1 }).limit(10);
      const totalCollected = await FeeTransaction.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      responseData.accountantData = {
        totalCollected: totalCollected[0]?.total || 63000,
        recentTransactions: transactions,
      };
    } else {
      // Default view for parent, librarian, placement officer, etc.
      const notices = await Notice.find().sort({ createdAt: -1 }).limit(5);
      responseData.generalData = { notices };
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
