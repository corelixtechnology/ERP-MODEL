import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Department from '../models/Department.js';
import FacultyProfile from '../models/FacultyProfile.js';
import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';
import Exam from '../models/Exam.js';
import Mark from '../models/Mark.js';
import LibraryBook from '../models/LibraryBook.js';
import Notice from '../models/Notice.js';
import FeeTransaction from '../models/FeeTransaction.js';
import ActivityLog from '../models/ActivityLog.js';
import SystemSettings from '../models/SystemSettings.js';

const seedUsers = [
  { name: 'Super Admin User', email: 'superadmin@erp.com', password: 'password123', role: 'super_admin', isActive: true },
  { name: 'System Admin', email: 'admin@erp.com', password: 'password123', role: 'admin', isActive: true },
  { name: 'Admission Officer', email: 'admission@erp.com', password: 'password123', role: 'admission_officer', isActive: true },
  { name: 'Dr. Alan Turing (HOD CS)', email: 'hod@erp.com', password: 'password123', role: 'hod', isActive: true },
  { name: 'Dr. John Doe (Faculty)', email: 'faculty@erp.com', password: 'password123', role: 'faculty', isActive: true },
  { name: 'Jane Smith (Student)', email: 'student@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Alex Morgan (Student)', email: 'alex.morgan@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Sophia Chen (Student)', email: 'sophia.chen@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Liam Johnson (Student)', email: 'liam.johnson@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Noah Williams (Student)', email: 'noah.williams@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Emma Watson (Student)', email: 'emma.watson@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Ethan Taylor (Student)', email: 'ethan.taylor@erp.com', password: 'password123', role: 'student', isActive: true },
  { name: 'Robert Smith (Parent)', email: 'parent@erp.com', password: 'password123', role: 'parent', isActive: true },
  { name: 'Sarah Connor (Accountant)', email: 'accountant@erp.com', password: 'password123', role: 'accountant', isActive: true },
  { name: 'Marcus Vance (Librarian)', email: 'librarian@erp.com', password: 'password123', role: 'librarian', isActive: true },
  { name: 'Elena Rostova (Hostel Warden)', email: 'warden@erp.com', password: 'password123', role: 'hostel_warden', isActive: true },
  { name: 'David Miller (Transport Manager)', email: 'transport@erp.com', password: 'password123', role: 'transport_manager', isActive: true },
  { name: 'Priya Sharma (Placement Officer)', email: 'placement@erp.com', password: 'password123', role: 'placement_officer', isActive: true },
  { name: 'Linda Watson (HR)', email: 'hr@erp.com', password: 'password123', role: 'hr', isActive: true },
  { name: 'Dr. Richard Feynman (Exam Controller)', email: 'exam@erp.com', password: 'password123', role: 'exam_cell', isActive: true },
  { name: 'Emily Clark (Reception Desk)', email: 'reception@erp.com', password: 'password123', role: 'reception', isActive: true },
];

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    const alexUser = await User.findOne({ email: 'alex.morgan@erp.com' });
    if (userCount < 20 || !alexUser) {
      console.log('Seeding enterprise role accounts, academic departments, courses, real-time student profiles, and ERP fee structures...');
      await User.deleteMany({});
      await Student.deleteMany({});
      await Course.deleteMany({});
      await Department.deleteMany({});
      await FacultyProfile.deleteMany({});
      await Attendance.deleteMany({});
      await Timetable.deleteMany({});
      await Exam.deleteMany({});
      await Mark.deleteMany({});
      await LibraryBook.deleteMany({});
      await Notice.deleteMany({});
      await FeeTransaction.deleteMany({});
      await ActivityLog.deleteMany({});
      await SystemSettings.deleteMany({});

      // 1. Create Users
      const createdUsers = await User.create(seedUsers);
      console.log('Successfully created demo user accounts!');

      const adminUser = createdUsers.find((u) => u.role === 'admin');
      const facultyUser = createdUsers.find((u) => u.role === 'faculty');
      const hodUser = createdUsers.find((u) => u.role === 'hod');
      const studentUser = createdUsers.find((u) => u.email === 'student@erp.com');
      const alexUser = createdUsers.find((u) => u.email === 'alex.morgan@erp.com');
      const sophiaUser = createdUsers.find((u) => u.email === 'sophia.chen@erp.com');
      const liamUser = createdUsers.find((u) => u.email === 'liam.johnson@erp.com');
      const noahUser = createdUsers.find((u) => u.email === 'noah.williams@erp.com');
      const emmaUser = createdUsers.find((u) => u.email === 'emma.watson@erp.com');
      const ethanUser = createdUsers.find((u) => u.email === 'ethan.taylor@erp.com');
      const examUser = createdUsers.find((u) => u.role === 'exam_cell');

      // 2. Create Departments
      const csDept = await Department.create({
        code: 'CSE',
        name: 'Computer Science & Engineering',
        hod: hodUser._id,
        description: 'Department of Computer Science & Engineering',
        programs: [
          { name: 'B.Tech Computer Science', code: 'BT-CSE', durationYears: 4, totalSemesters: 8 },
          { name: 'M.Tech Software Engineering', code: 'MT-SE', durationYears: 2, totalSemesters: 4 },
        ],
      });

      const eceDept = await Department.create({
        code: 'ECE',
        name: 'Electronics & Communication',
        description: 'Department of Electronics & Communication Engineering',
        programs: [
          { name: 'B.Tech ECE', code: 'BT-ECE', durationYears: 4, totalSemesters: 8 },
        ],
      });

      await Department.create({
        code: 'ME',
        name: 'Mechanical Engineering',
        description: 'Department of Mechanical & Industrial Systems',
        programs: [
          { name: 'B.Tech Mechanical', code: 'BT-ME', durationYears: 4, totalSemesters: 8 },
        ],
      });

      // 3. Faculty Profiles (Teaching Staff)
      await FacultyProfile.create([
        {
          user: facultyUser._id,
          employeeId: 'EMP2026001',
          designation: 'Associate Professor',
          department: 'Computer Science & Engineering',
          specialization: 'Artificial Intelligence & Web Architectures',
          salary: 85000,
        },
        {
          user: hodUser._id,
          employeeId: 'EMP2026000',
          designation: 'Head of Department',
          department: 'Computer Science & Engineering',
          specialization: 'Algorithms & Computing Systems',
          salary: 110000,
        },
      ]);

      // 4. Student Profiles with Real-Time Fee Structures & Balances
      await Student.create([
        {
          user: studentUser._id,
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
        },
        {
          user: alexUser._id,
          rollNumber: 'STU20260002',
          department: 'Computer Science & Engineering',
          batch: '2023-2027',
          semester: 5,
          totalFee: 50000,
          paidFee: 50000,
          discount: 0,
          dues: 0,
          feeCategory: 'B.Tech Computer Science Tuition',
          feeStatus: 'Paid',
          dueDate: new Date('2026-08-15'),
          breakdown: {
            tuitionFee: 35000,
            developmentFee: 5000,
            libraryFee: 2500,
            examFee: 2500,
            hostelFee: 5000,
          },
        },
        {
          user: sophiaUser._id,
          rollNumber: 'STU20260003',
          department: 'Electronics & Communication',
          batch: '2024-2028',
          semester: 3,
          totalFee: 46000,
          paidFee: 20000,
          discount: 1500,
          dues: 24500,
          feeCategory: 'B.Tech ECE Tuition',
          feeStatus: 'Partial',
          dueDate: new Date('2026-09-05'),
          breakdown: {
            tuitionFee: 32000,
            developmentFee: 4500,
            libraryFee: 2000,
            examFee: 2500,
            hostelFee: 5000,
          },
        },
        {
          user: liamUser._id,
          rollNumber: 'STU20260004',
          department: 'Computer Science & Engineering',
          batch: '2023-2027',
          semester: 5,
          totalFee: 52000,
          paidFee: 0,
          discount: 0,
          dues: 52000,
          feeCategory: 'B.Tech CS Tuition + Hostel',
          feeStatus: 'Pending',
          dueDate: new Date('2026-08-10'),
          breakdown: {
            tuitionFee: 35000,
            developmentFee: 5000,
            libraryFee: 2000,
            examFee: 2000,
            hostelFee: 8000,
          },
        },
        {
          user: noahUser._id,
          rollNumber: 'STU20260005',
          department: 'Mechanical Engineering',
          batch: '2022-2026',
          semester: 7,
          totalFee: 48000,
          paidFee: 48000,
          discount: 3000,
          dues: 0,
          feeCategory: 'B.Tech Mechanical Tuition',
          feeStatus: 'Paid',
          dueDate: new Date('2026-07-20'),
          breakdown: {
            tuitionFee: 33000,
            developmentFee: 5000,
            libraryFee: 2500,
            examFee: 2500,
            hostelFee: 5000,
          },
        },
        {
          user: emmaUser._id,
          rollNumber: 'STU20260006',
          department: 'Computer Science & Engineering',
          batch: '2024-2028',
          semester: 3,
          totalFee: 50000,
          paidFee: 25000,
          discount: 0,
          dues: 25000,
          feeCategory: 'B.Tech CS Merit Scholar',
          feeStatus: 'Partial',
          dueDate: new Date('2026-08-25'),
          breakdown: {
            tuitionFee: 35000,
            developmentFee: 5000,
            libraryFee: 2500,
            examFee: 2500,
            hostelFee: 5000,
          },
        },
        {
          user: ethanUser._id,
          rollNumber: 'STU20260007',
          department: 'Electronics & Communication',
          batch: '2023-2027',
          semester: 5,
          totalFee: 46000,
          paidFee: 46000,
          discount: 0,
          dues: 0,
          feeCategory: 'B.Tech ECE Regular Tuition',
          feeStatus: 'Paid',
          dueDate: new Date('2026-07-30'),
          breakdown: {
            tuitionFee: 32000,
            developmentFee: 4500,
            libraryFee: 2000,
            examFee: 2500,
            hostelFee: 5000,
          },
        },
      ]);

      // 5. Courses
      const cs101 = await Course.create({
        courseCode: 'CS101',
        title: 'Advanced Web Architecture & Enterprise Design',
        credits: 4,
        department: 'Computer Science & Engineering',
        semester: 5,
        faculty: facultyUser._id,
      });

      const cs102 = await Course.create({
        courseCode: 'CS102',
        title: 'Database Management & Cloud Architecture',
        credits: 4,
        department: 'Computer Science & Engineering',
        semester: 5,
        faculty: hodUser._id,
      });

      const cs103 = await Course.create({
        courseCode: 'CS103',
        title: 'Data Structures & Algorithmic Complexity',
        credits: 4,
        department: 'Computer Science & Engineering',
        semester: 3,
        faculty: facultyUser._id,
      });

      const ece201 = await Course.create({
        courseCode: 'ECE201',
        title: 'Digital Signal Processing & Microcontrollers',
        credits: 4,
        department: 'Electronics & Communication',
        semester: 5,
        faculty: hodUser._id,
      });

      // 6. Attendance records
      const today = new Date();
      const d1 = new Date(today); d1.setDate(today.getDate() - 1);
      const d2 = new Date(today); d2.setDate(today.getDate() - 2);
      const d3 = new Date(today); d3.setDate(today.getDate() - 3);
      const d4 = new Date(today); d4.setDate(today.getDate() - 4);
      const d5 = new Date(today); d5.setDate(today.getDate() - 5);
      const d6 = new Date(today); d6.setDate(today.getDate() - 6);
      const d7 = new Date(today); d7.setDate(today.getDate() - 7);

      await Attendance.create([
        { student: studentUser._id, course: cs101._id, status: 'Present', markedBy: facultyUser._id, date: today, method: 'QR' },
        { student: studentUser._id, course: cs102._id, status: 'Present', markedBy: hodUser._id, date: today, method: 'Biometric' },
        { student: studentUser._id, course: cs101._id, status: 'Present', markedBy: facultyUser._id, date: d1, method: 'Manual' },
        { student: studentUser._id, course: cs102._id, status: 'Late', markedBy: hodUser._id, date: d2, method: 'QR' },
        { student: studentUser._id, course: cs101._id, status: 'Present', markedBy: facultyUser._id, date: d3, method: 'Biometric' },
        { student: studentUser._id, course: cs102._id, status: 'Present', markedBy: hodUser._id, date: d4, method: 'Manual' },
        { student: studentUser._id, course: cs101._id, status: 'Absent', markedBy: facultyUser._id, date: d5, method: 'Manual' },
        { student: studentUser._id, course: cs102._id, status: 'Present', markedBy: hodUser._id, date: d6, method: 'QR' },
        { student: studentUser._id, course: cs101._id, status: 'Excused', markedBy: facultyUser._id, date: d7, method: 'Manual' },
        { student: alexUser._id, course: cs101._id, status: 'Present', markedBy: facultyUser._id, date: today, method: 'Biometric' },
        { student: alexUser._id, course: cs102._id, status: 'Present', markedBy: hodUser._id, date: d1, method: 'QR' },
        { student: alexUser._id, course: cs101._id, status: 'Absent', markedBy: facultyUser._id, date: d2, method: 'Manual' },
      ]);

      // 7. Timetable
      await Timetable.create([
        {
          department: 'Computer Science & Engineering',
          semester: 5,
          section: 'A',
          day: 'Monday',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          course: cs101._id,
          faculty: facultyUser._id,
          roomNumber: 'Lab-301',
        },
        {
          department: 'Computer Science & Engineering',
          semester: 5,
          section: 'A',
          day: 'Monday',
          startTime: '10:15 AM',
          endTime: '11:15 AM',
          course: cs102._id,
          faculty: hodUser._id,
          roomNumber: 'Hall-102',
        },
      ]);

      // 8. Exams & Marks
      const midSemExamCS101 = await Exam.create({
        title: 'Mid-Semester Exam — Data Structures',
        examType: 'MidSem',
        department: 'Computer Science & Engineering',
        semester: 5,
        course: cs101._id,
        maxMarks: 50,
        isPublished: true,
      });

      const midSemExamCS102 = await Exam.create({
        title: 'Mid-Semester Exam — Database Systems',
        examType: 'MidSem',
        department: 'Computer Science & Engineering',
        semester: 5,
        course: cs102._id,
        maxMarks: 50,
        isPublished: true,
      });

      const labExamCS101 = await Exam.create({
        title: 'Practical Lab Exam — DS & Algorithms',
        examType: 'Practical',
        department: 'Computer Science & Engineering',
        semester: 5,
        course: cs101._id,
        maxMarks: 100,
        isPublished: true,
      });

      const endSemExamCS101 = await Exam.create({
        title: 'End-Semester Theory Exam — CS101',
        examType: 'EndSem',
        department: 'Computer Science & Engineering',
        semester: 5,
        course: cs101._id,
        maxMarks: 100,
        isPublished: true,
      });

      await Mark.create([
        { exam: midSemExamCS101._id, student: studentUser._id, marksObtained: 46, grade: 'A+', remarks: 'Excellent score (92%)' },
        { exam: midSemExamCS102._id, student: studentUser._id, marksObtained: 44, grade: 'A', remarks: 'Strong relational modeling skills' },
        { exam: labExamCS101._id, student: studentUser._id, marksObtained: 94, grade: 'O', remarks: 'Perfect code implementation' },
        { exam: endSemExamCS101._id, student: studentUser._id, marksObtained: 88, grade: 'A+', remarks: 'Top 5 percentile ranking' },
        { exam: midSemExamCS101._id, student: alexUser._id, marksObtained: 48, grade: 'O', remarks: 'Top Scorer in Department' },
        { exam: midSemExamCS102._id, student: alexUser._id, marksObtained: 45, grade: 'A+', remarks: 'Great database design' },
      ]);

      // 9. Library Books
      await LibraryBook.create([
        { isbn: '978-0131103627', title: 'The C Programming Language (2nd Ed)', author: 'Brian W. Kernighan & Dennis Ritchie', category: 'Computer Science', totalCopies: 10, availableCopies: 8, rackLocation: 'CS-A1' },
        { isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen, Charles E. Leiserson', category: 'Algorithms', totalCopies: 15, availableCopies: 12, rackLocation: 'CS-A2' },
        { isbn: '978-0133591620', title: 'Operating System Concepts (10th Ed)', author: 'Abraham Silberschatz, Peter B. Galvin', category: 'Systems', totalCopies: 8, availableCopies: 6, rackLocation: 'SYS-B4' },
        { isbn: '978-0134685991', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', category: 'Software Eng', totalCopies: 12, availableCopies: 9, rackLocation: 'SE-C3' },
        { isbn: '978-1491957660', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Database Systems', totalCopies: 10, availableCopies: 7, rackLocation: 'DB-D1' },
        { isbn: '978-0134685992', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', category: 'Artificial Intelligence', totalCopies: 14, availableCopies: 10, rackLocation: 'AI-E2' },
      ]);

      // 10. Notices
      await Notice.create([
        {
          title: 'Campus Placement Drive 2026 Announced',
          content: 'Registration is now open for upcoming tier-1 software engineering placement rounds.',
          targetRoles: ['student', 'faculty', 'all'],
          postedBy: adminUser._id,
          priority: 'High',
        },
        {
          title: 'Mid-Semester Exam Schedule Published',
          content: 'Students can check their exam timetable and seat numbers under the Examination tab.',
          targetRoles: ['student'],
          postedBy: examUser._id,
          priority: 'Normal',
        },
        {
          title: 'Fee Payment & Installment Notice - Academic Session 2026-27',
          content: 'Account office notification: Please clear outstanding tuition & lab dues before August 30 to prevent late processing fees.',
          targetRoles: ['student', 'parent', 'all'],
          postedBy: adminUser._id,
          priority: 'High',
        },
      ]);

      // 11. Fee Transactions (Real-Time Example Payment History)
      await FeeTransaction.create([
        {
          student: studentUser._id,
          receiptNumber: 'REC-2026-8801',
          transactionId: 'TXN8492019482',
          amount: 25000,
          paymentMethod: 'Online UPI (GPay)',
          feeCategory: 'Semester 5 Initial Tuition Deposit',
          status: 'success',
          remarks: 'Part payment received via online gateway',
          createdAt: new Date('2026-07-02'),
        },
        {
          student: studentUser._id,
          receiptNumber: 'REC-2026-8802',
          transactionId: 'TXN9182304912',
          amount: 13500,
          paymentMethod: 'Net Banking (HDFC)',
          feeCategory: 'Lab & Development Installment',
          status: 'success',
          remarks: 'Second installment cleared successfully',
          createdAt: new Date('2026-07-20'),
        },
        {
          student: alexUser._id,
          receiptNumber: 'REC-2026-8803',
          transactionId: 'TXN7781920391',
          amount: 50000,
          paymentMethod: 'Credit Card (HDFC Visa)',
          feeCategory: 'Full Academic Year Fees',
          status: 'success',
          remarks: 'Full annual tuition paid upfront',
          createdAt: new Date('2026-06-15'),
        },
        {
          student: sophiaUser._id,
          receiptNumber: 'REC-2026-8804',
          transactionId: 'TXN4481029410',
          amount: 20000,
          paymentMethod: 'Online UPI (PhonePe)',
          feeCategory: 'Semester 3 Tuition Fee',
          status: 'success',
          remarks: 'Initial deposit for Semester 3',
          createdAt: new Date('2026-07-10'),
        },
        {
          student: noahUser._id,
          receiptNumber: 'REC-2026-8805',
          transactionId: 'TXN3381920491',
          amount: 45000,
          paymentMethod: 'Bank Demand Draft',
          feeCategory: 'Semester 7 Final Clearance',
          status: 'success',
          remarks: 'DD #884912 cleared by Accounts',
          createdAt: new Date('2026-07-18'),
        },
        {
          student: ethanUser._id,
          receiptNumber: 'REC-2026-8806',
          transactionId: 'TXN2291048192',
          amount: 46000,
          paymentMethod: 'Net Banking (ICICI)',
          feeCategory: 'Full Academic Fees',
          status: 'success',
          remarks: 'Annual fee paid in full',
          createdAt: new Date('2026-07-28'),
        },
      ]);

      // 12. System Settings
      await SystemSettings.create({
        collegeName: 'Global Institute of Engineering & Technology',
        sessionYear: '2026-2027',
        attendanceThreshold: 75,
      });

      // 13. Activity Logs
      await ActivityLog.create([
        { action: 'System Initialization', description: 'Enterprise College ERP deployed with complete student profiles & fee management suite', performedBy: adminUser._id },
      ]);

      console.log('Successfully seeded real-time student profiles, courses, staff, and fee records!');
    }
  } catch (error) {
    console.error('Error during autoSeed execution:', error.message);
  }
};

export default autoSeed;
