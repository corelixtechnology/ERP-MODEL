import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import FeeTransaction from '../models/FeeTransaction.js';
import ActivityLog from '../models/ActivityLog.js';
import SystemSettings from '../models/SystemSettings.js';

// Helper to log activities
const logActivity = async (action, description, userId) => {
  try {
    await ActivityLog.create({
      action,
      description,
      performedBy: userId,
    });
  } catch (error) {
    console.error('Error logging activity:', error.message);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Sum revenue from FeeTransaction
    const revenueResult = await FeeTransaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Sum dues from Student
    const duesResult = await Student.aggregate([
      { $group: { _id: null, total: { $sum: '$dues' } } },
    ]);
    const pendingDues = duesResult.length > 0 ? duesResult[0].total : 0;

    // Enrollment by Department for Chart
    const enrollmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { department: '$_id', count: 1, _id: 0 } },
    ]);

    // Recent 5 activities
    let recentActivities = await ActivityLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);

    // Fallback if no activities logged yet
    if (recentActivities.length === 0) {
      const recentStudents = await User.find({ role: 'student' })
        .sort({ createdAt: -1 })
        .limit(5);
      recentActivities = recentStudents.map(student => ({
        _id: student._id,
        action: 'Student Registered',
        description: `Student ${student.name} was added to the platform`,
        createdAt: student.createdAt,
      }));
    }

    res.status(200).json({
      stats: {
        totalStudents,
        totalFaculty,
        totalCourses,
        totalRevenue,
        pendingDues,
        totalUsers,
      },
      enrollmentStats,
      recentActivities,
    });
  } catch (error) {
    console.error(`getDashboardStats error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (paginated and filterable)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { role, search } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Alternatively, manual injection if virtual population is not full
    const usersWithStudentData = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        if (user.role === 'student') {
          const studentInfo = await Student.findOne({ user: user._id });
          if (studentInfo) {
            userObj.studentInfo = studentInfo;
          }
        }
        return userObj;
      })
    );
    res.status(200).json({
      users: usersWithStudentData,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(`getAllUsers error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a user
// @route   POST /api/v1/admin/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, batch, dues, semester } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: true,
    });

    // Create Student entry if role is student
    if (role === 'student') {
      const studentCount = await Student.countDocuments();
      const currentYear = new Date().getFullYear();
      const rollNumber = `STU${currentYear}${String(studentCount + 1).padStart(4, '0')}`;

      await Student.create({
        user: user._id,
        rollNumber,
        department: department || 'Computer Science',
        batch: batch || `${currentYear}-${currentYear + 4}`,
        semester: semester || 1,
        dues: dues || 0,
      });
    }

    await logActivity('User Created', `Created ${role} account for ${name} (${email})`, req.user._id);

    // Fetch user details with student details to return
    let studentData = null;
    if (role === 'student') {
      studentData = await Student.findOne({ user: user._id });
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    if (studentData) {
      userResponse.studentInfo = studentData;
    }

    res.status(201).json(userResponse);
  } catch (error) {
    console.error(`createUser error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, department, batch, semester, dues } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Hash password if updating password
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    // If user is a student, update or create student record
    if (user.role === 'student') {
      let student = await Student.findOne({ user: user._id });
      if (!student) {
        const studentCount = await Student.countDocuments();
        const currentYear = new Date().getFullYear();
        const rollNumber = `STU${currentYear}${String(studentCount + 1).padStart(4, '0')}`;
        student = new Student({
          user: user._id,
          rollNumber,
          department: department || 'Computer Science',
          batch: batch || `${currentYear}-${currentYear + 4}`,
          semester: semester || 1,
          dues: dues || 0,
        });
      } else {
        if (department) student.department = department;
        if (batch) student.batch = batch;
        if (semester !== undefined) student.semester = semester;
        if (dues !== undefined) student.dues = dues;
      }
      await student.save();
    }

    await logActivity('User Updated', `Updated account details for ${user.name}`, req.user._id);

    const userResponse = await User.findById(user._id).select('-password');
    const userObj = userResponse.toObject();

    if (user.role === 'student') {
      userObj.studentInfo = await Student.findOne({ user: user._id });
    }

    res.status(200).json(userObj);
  } catch (error) {
    console.error(`updateUser error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hand cascade deletion for student
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: user._id });
      await FeeTransaction.deleteMany({ student: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    await logActivity('User Deleted', `Deleted ${user.role} account: ${user.name}`, req.user._id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`deleteUser error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all courses (paginated)
// @route   GET /api/v1/admin/courses
// @access  Private/Admin
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Course.countDocuments();
    const courses = await Course.find()
      .populate('faculty', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      courses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(`getAllCourses error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create course
// @route   POST /api/v1/admin/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const { courseCode, title, credits, department, semester, faculty } = req.body;

    if (!courseCode || !title || !credits || !department || !semester || !faculty) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if course exists
    const courseExists = await Course.findOne({ courseCode });
    if (courseExists) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Verify assigned faculty user role
    const facultyUser = await User.findById(faculty);
    if (!facultyUser || facultyUser.role !== 'faculty') {
      return res.status(400).json({ message: 'Assigned faculty must be a valid faculty user' });
    }

    const course = await Course.create({
      courseCode,
      title,
      credits,
      department,
      semester,
      faculty,
    });

    const populatedCourse = await Course.findById(course._id).populate('faculty', 'name email role');

    await logActivity('Course Created', `Created course ${title} (${courseCode})`, req.user._id);

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error(`createCourse error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update course
// @route   PUT /api/v1/admin/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const { courseCode, title, credits, department, semester, faculty } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If changing course code, check for conflicts
    if (courseCode && courseCode !== course.courseCode) {
      const codeExists = await Course.findOne({ courseCode });
      if (codeExists) {
        return res.status(400).json({ message: 'Course code already exists' });
      }
      course.courseCode = courseCode;
    }

    // If changing faculty, verify the assigned user is a faculty member
    if (faculty) {
      const facultyUser = await User.findById(faculty);
      if (!facultyUser || facultyUser.role !== 'faculty') {
        return res.status(400).json({ message: 'Assigned faculty must be a valid faculty user' });
      }
      course.faculty = faculty;
    }

    if (title) course.title = title;
    if (credits) course.credits = credits;
    if (department) course.department = department;
    if (semester) course.semester = semester;

    await course.save();

    const populatedCourse = await Course.findById(course._id).populate('faculty', 'name email role');

    await logActivity('Course Updated', `Updated details of course ${course.title} (${course.courseCode})`, req.user._id);

    res.status(200).json(populatedCourse);
  } catch (error) {
    console.error(`updateCourse error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete course
// @route   DELETE /api/v1/admin/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);

    await logActivity('Course Deleted', `Deleted course ${course.title} (${course.courseCode})`, req.user._id);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(`deleteCourse error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({
        collegeName: 'EduERP Institute of Technology',
        sessionYear: '2026-2027',
        attendanceThreshold: 75,
      });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error(`getSystemSettings error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  try {
    const { collegeName, sessionYear, attendanceThreshold } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings({});
    }

    if (collegeName) settings.collegeName = collegeName;
    if (sessionYear) settings.sessionYear = sessionYear;
    if (attendanceThreshold !== undefined) settings.attendanceThreshold = attendanceThreshold;

    await settings.save();

    await logActivity('Settings Updated', 'Updated system configurations', req.user._id);

    res.status(200).json(settings);
  } catch (error) {
    console.error(`updateSystemSettings error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
