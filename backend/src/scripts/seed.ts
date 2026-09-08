import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../config/logger';
import { hashPassword } from '../common/utils/password';
import { ADMIN_ROLES, PUBLISHING_STATUS, DIFFICULTY_LEVELS, LEAD_STATUS, COURSE_MODES, EVENT_TYPES } from '../common/constants';

import { AdminModel } from '../modules/admins/admins.model';
import { AcademicYearModel } from '../modules/academic-years/academic-years.model';
import { BranchModel } from '../modules/branches/branches.model';
import { SemesterModel } from '../modules/semesters/semesters.model';
import { SubjectModel } from '../modules/subjects/subjects.model';
import { PYQModel } from '../modules/pyqs/pyqs.model';
import { NoteModel } from '../modules/notes/notes.model';
import { VideoModel } from '../modules/videos/videos.model';
import { PlaylistModel } from '../modules/playlists/playlists.model';
import { ProjectModel } from '../modules/projects/projects.model';
import { JobModel } from '../modules/jobs/jobs.model';
import { CareerResourceModel } from '../modules/career/career.model';
import { CourseModel } from '../modules/courses/courses.model';
import { FacultyModel } from '../modules/faculty/faculty.model';
import { EventModel } from '../modules/events/events.model';
import { AnnouncementModel } from '../modules/announcements/announcements.model';
import { LeadModel } from '../modules/leads/leads.model';
import { SettingModel } from '../modules/settings/settings.model';

async function runSeed() {
  try {
    logger.info('🌱 Starting database seeding with realistic engineering curriculum & platform data...');
    await connectDatabase();

    // 1. Clear existing collections
    await Promise.all([
      AdminModel.deleteMany({}),
      AcademicYearModel.deleteMany({}),
      BranchModel.deleteMany({}),
      SemesterModel.deleteMany({}),
      SubjectModel.deleteMany({}),
      PYQModel.deleteMany({}),
      NoteModel.deleteMany({}),
      VideoModel.deleteMany({}),
      PlaylistModel.deleteMany({}),
      ProjectModel.deleteMany({}),
      JobModel.deleteMany({}),
      CareerResourceModel.deleteMany({}),
      CourseModel.deleteMany({}),
      FacultyModel.deleteMany({}),
      EventModel.deleteMany({}),
      AnnouncementModel.deleteMany({}),
      LeadModel.deleteMany({}),
      SettingModel.deleteMany({}),
    ]);
    logger.info('🧹 Cleared existing database records.');

    // 2. Admins
    const superAdminPassword = await hashPassword('Admin@12345');
    const editorPassword = await hashPassword('Editor@12345');

    const superAdmin = await AdminModel.create({
      name: 'Dr. Rajesh Verma (Director)',
      email: 'admin@engineering.edu',
      passwordHash: superAdminPassword,
      role: ADMIN_ROLES.SUPER_ADMIN,
      isActive: true,
    });

    const editor = await AdminModel.create({
      name: 'Prof. Ananya Sen',
      email: 'editor@engineering.edu',
      passwordHash: editorPassword,
      role: ADMIN_ROLES.EDITOR,
      isActive: true,
    });
    logger.info(`👤 Created Admins: admin@engineering.edu & editor@engineering.edu`);

    // 3. Academic Years
    const academicYears = await AcademicYearModel.insertMany([
      { name: 'First Year Engineering (FE)', code: 'FE', order: 1, description: 'Common Foundation Engineering Curriculum' },
      { name: 'Second Year Engineering (SE)', code: 'SE', order: 2, description: 'Core Engineering Fundamentals & Discrete Mathematics' },
      { name: 'Third Year Engineering (TE)', code: 'TE', order: 3, description: 'Advanced Specialization & System Architecture' },
      { name: 'Final Year Engineering (BE)', code: 'BE', order: 4, description: 'Capstone Projects, Electives & Industry Preparation' },
    ]);
    const [fe, se, te, be] = academicYears;

    // 4. Engineering Branches
    const branches = await BranchModel.insertMany([
      {
        name: 'Computer Science & Engineering',
        code: 'CSE',
        slug: 'cse',
        icon: 'Laptop',
        description: 'Algorithms, Database Systems, Computer Networks, Distributed Systems, Software Engineering.',
        totalSemesters: 8,
        order: 1,
      },
      {
        name: 'Information Technology',
        code: 'IT',
        slug: 'it',
        icon: 'Cpu',
        description: 'Web Architecture, Cloud Computing, Cybersecurity, Information Security, Full Stack Systems.',
        totalSemesters: 8,
        order: 2,
      },
      {
        name: 'Artificial Intelligence & Data Science',
        code: 'AIDS',
        slug: 'aids',
        icon: 'BrainCircuit',
        description: 'Machine Learning, Deep Neural Networks, Big Data Analytics, NLP, Predictive Modeling.',
        totalSemesters: 8,
        order: 3,
      },
      {
        name: 'Electronics & Telecommunication',
        code: 'ETC',
        slug: 'etc',
        icon: 'Radio',
        description: 'Digital Signal Processing, Embedded Systems, VLSI Design, Wireless Communications.',
        totalSemesters: 8,
        order: 4,
      },
      {
        name: 'Mechanical Engineering',
        code: 'MECH',
        slug: 'mech',
        icon: 'Cog',
        description: 'Thermodynamics, Fluid Mechanics, CAD/CAM, Manufacturing Technology, Robotics.',
        totalSemesters: 8,
        order: 5,
      },
      {
        name: 'Civil Engineering',
        code: 'CIVIL',
        slug: 'civil',
        icon: 'Building2',
        description: 'Structural Analysis, Geotechnical Engineering, Environmental Systems, Construction Management.',
        totalSemesters: 8,
        order: 6,
      },
    ]);
    const [cseBranch, itBranch, aidsBranch, etcBranch, mechBranch] = branches;

    // 5. Semesters
    const semesters = await SemesterModel.insertMany([
      { number: 1, name: 'Semester 1', slug: 'sem-1', academicYearId: fe._id },
      { number: 2, name: 'Semester 2', slug: 'sem-2', academicYearId: fe._id },
      { number: 3, name: 'Semester 3', slug: 'sem-3', academicYearId: se._id },
      { number: 4, name: 'Semester 4', slug: 'sem-4', academicYearId: se._id },
      { number: 5, name: 'Semester 5', slug: 'sem-5', academicYearId: te._id },
      { number: 6, name: 'Semester 6', slug: 'sem-6', academicYearId: te._id },
      { number: 7, name: 'Semester 7', slug: 'sem-7', academicYearId: be._id },
      { number: 8, name: 'Semester 8', slug: 'sem-8', academicYearId: be._id },
    ]);
    const [sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8] = semesters;

    // 6. Subjects
    const subjects = await SubjectModel.insertMany([
      // CSE Semester 5
      {
        name: 'Database Management Systems',
        code: 'CS501',
        slug: 'database-management-systems-cs501',
        branchId: cseBranch._id,
        semesterId: sem5._id,
        credits: 4,
        description: 'Relational algebra, SQL, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control, Indexing and NoSQL.',
        syllabusOverview: 'Deep dive into relational engine internals, query optimization, ACID compliance, and MongoDB document schemas.',
        units: [
          { unitNumber: 1, title: 'Introduction & Entity Relationship Data Modeling', keyTopics: ['DBMS Architecture', 'ER Diagrams', 'Relational Model Constraints', 'Relational Algebra Operations'], weightagePercentage: 15 },
          { unitNumber: 2, title: 'SQL & Relational Query Languages', keyTopics: ['DDL/DML Commands', 'Complex Joins', 'Subqueries', 'Views', 'Triggers & Stored Procedures'], weightagePercentage: 20 },
          { unitNumber: 3, title: 'Relational Database Design & Normalization', keyTopics: ['Functional Dependencies', '1NF, 2NF, 3NF', 'Boyce-Codd Normal Form (BCNF)', 'Lossless Decomposition', 'Dependency Preservation'], weightagePercentage: 25 },
          { unitNumber: 4, title: 'Transaction Processing & Concurrency', keyTopics: ['ACID Properties', 'Schedules & Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Handling', 'Timestamp Ordering'], weightagePercentage: 20 },
          { unitNumber: 5, title: 'Storage, Indexing & NoSQL Overview', keyTopics: ['B+ Trees', 'Hashing', 'Crash Recovery & WAL', 'CAP Theorem', 'Document Stores (MongoDB)'], weightagePercentage: 20 },
        ],
        recommendedBooks: [
          { title: 'Database System Concepts (7th Edition)', author: 'Silberschatz, Korth, Sudarshan' },
          { title: 'Fundamentals of Database Systems', author: 'Elmasri & Navathe' },
        ],
        order: 1,
      },
      {
        name: 'Theory of Computation & Automata',
        code: 'CS502',
        slug: 'theory-of-computation-cs502',
        branchId: cseBranch._id,
        semesterId: sem5._id,
        credits: 4,
        description: 'Finite Automata, Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines, and Decidability.',
        syllabusOverview: 'Theoretical foundation of formal languages, parsing, computation limits, and Church-Turing thesis.',
        units: [
          { unitNumber: 1, title: 'Finite Automata & Regular Languages', keyTopics: ['DFA & NFA Construction', 'NFA to DFA Conversion', 'Minimization of DFA', 'Myhill-Nerode Theorem'], weightagePercentage: 20 },
          { unitNumber: 2, title: 'Regular Expressions & Pumping Lemma', keyTopics: ['RegEx conversion to FA', 'Arden’s Theorem', 'Pumping Lemma for Regular Languages', 'Closure Properties'], weightagePercentage: 20 },
          { unitNumber: 3, title: 'Context-Free Grammars & Pushdown Automata', keyTopics: ['Derivation Trees', 'Ambiguity', 'Chomsky Normal Form (CNF)', 'Greibach Normal Form (GNF)', 'DPDA vs NPDA'], weightagePercentage: 25 },
          { unitNumber: 4, title: 'Turing Machines & Decidability', keyTopics: ['Turing Machine Model', 'Multi-tape TM', 'Universal Turing Machine', 'Halting Problem', 'Rice’s Theorem'], weightagePercentage: 20 },
          { unitNumber: 5, title: 'Computational Complexity Classes', keyTopics: ['Class P and NP', 'NP-Completeness', 'SAT Problem', 'Polynomial Reductions'], weightagePercentage: 15 },
        ],
        recommendedBooks: [
          { title: 'Introduction to Automata Theory, Languages, and Computation', author: 'Hopcroft, Motwani, Ullman' },
          { title: 'Introduction to the Theory of Computation', author: 'Michael Sipser' },
        ],
        order: 2,
      },
      {
        name: 'Computer Networks & Internet Protocols',
        code: 'CS503',
        slug: 'computer-networks-cs503',
        branchId: cseBranch._id,
        semesterId: sem5._id,
        credits: 4,
        description: 'OSI & TCP/IP stack, Data Link Layer, IP Addressing & Subnetting, Routing Algorithms, TCP Congestion Control, DNS & HTTP.',
        syllabusOverview: 'Comprehensive study of packet switched networks, socket programming, routing protocols (OSPF, BGP), and transport layer performance.',
        units: [
          { unitNumber: 1, title: 'Physical & Data Link Layer Protocols', keyTopics: ['Framing', 'Error Detection (CRC)', 'Sliding Window Protocols', 'CSMA/CD & Ethernet'], weightagePercentage: 20 },
          { unitNumber: 2, title: 'Network Layer & IP Addressing', keyTopics: ['IPv4 vs IPv6 Header', 'CIDR & Subnetting Calculations', 'NAT', 'ICMP Protocol'], weightagePercentage: 25 },
          { unitNumber: 3, title: 'Routing Algorithms & Autonomous Systems', keyTopics: ['Distance Vector Routing', 'Link State Routing (Dijkstra)', 'OSPF Protocol', 'BGP Exterior Gateway'], weightagePercentage: 20 },
          { unitNumber: 4, title: 'Transport Layer & Congestion Control', keyTopics: ['TCP 3-Way Handshake', 'Flow Control & Sliding Window', 'Slow Start & Congestion Avoidance', 'UDP Sockets'], weightagePercentage: 20 },
          { unitNumber: 5, title: 'Application Layer & Network Security', keyTopics: ['DNS Resolution', 'HTTP/1.1 vs HTTP/2 vs HTTP/3', 'TLS/SSL Handshake', 'Firewalls'], weightagePercentage: 15 },
        ],
        recommendedBooks: [
          { title: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross' },
          { title: 'Computer Networks', author: 'Andrew S. Tanenbaum' },
        ],
        order: 3,
      },
      // FE Common
      {
        name: 'Engineering Mathematics I',
        code: 'MA101',
        slug: 'engineering-mathematics-i-ma101',
        branchId: cseBranch._id,
        semesterId: sem1._id,
        credits: 4,
        description: 'Matrices, Eigenvalues, Successive Differentiation, Taylor Series, Partial Differentiation, and Jacobians.',
        syllabusOverview: 'Foundational calculus and linear algebra for engineering problem formulation and analysis.',
        units: [
          { unitNumber: 1, title: 'Linear Algebra & Matrices', keyTopics: ['Rank of Matrix', 'System of Linear Equations', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem'], weightagePercentage: 25 },
          { unitNumber: 2, title: 'Differential Calculus', keyTopics: ['Leibnitz’s Theorem', 'Taylor’s & Maclaurin’s Series Expansion', 'Indeterminate Forms', 'L’Hopital’s Rule'], weightagePercentage: 25 },
          { unitNumber: 3, title: 'Partial Differentiation & Applications', keyTopics: ['Euler’s Theorem for Homogeneous Functions', 'Jacobians & Properties', 'Maxima & Minima of Two Variables'], weightagePercentage: 25 },
          { unitNumber: 4, title: 'Fourier Series & Differential Equations', keyTopics: ['Dirichlet’s Conditions', 'Half-Range Fourier Series', 'Exact Differential Equations', 'Orthogonal Trajectories'], weightagePercentage: 25 },
        ],
        recommendedBooks: [
          { title: 'Higher Engineering Mathematics', author: 'Dr. B.S. Grewal' },
          { title: 'Advanced Engineering Mathematics', author: 'Erwin Kreyszig' },
        ],
        order: 1,
      },
      // AI & DS Semester 5
      {
        name: 'Machine Learning Algorithms',
        code: 'AI501',
        slug: 'machine-learning-algorithms-ai501',
        branchId: aidsBranch._id,
        semesterId: sem5._id,
        credits: 4,
        description: 'Supervised Learning (Regression, Trees, SVM), Unsupervised Clustering (K-Means, PCA), Neural Networks, and Model Evaluation.',
        syllabusOverview: 'Mathematical formulations and implementations of core machine learning algorithms from scratch and with Scikit-Learn.',
        units: [
          { unitNumber: 1, title: 'Foundations of Machine Learning', keyTopics: ['Parametric vs Non-Parametric', 'Gradient Descent Optimization', 'Bias-Variance Tradeoff', 'Cross-Validation'], weightagePercentage: 20 },
          { unitNumber: 2, title: 'Supervised Linear & Non-Linear Models', keyTopics: ['Multiple Linear Regression', 'Logistic Regression', 'Support Vector Machines (Kernel Trick)', 'Decision Trees & Random Forests'], weightagePercentage: 25 },
          { unitNumber: 3, title: 'Unsupervised Learning & Dimensionality Reduction', keyTopics: ['K-Means Clustering', 'Hierarchical Clustering', 'Principal Component Analysis (PCA)', 't-SNE'], weightagePercentage: 20 },
          { unitNumber: 4, title: 'Ensemble Learning & Boosting', keyTopics: ['AdaBoost Algorithm', 'Gradient Boosting (XGBoost)', 'Stacking & Voting Classifiers'], weightagePercentage: 20 },
          { unitNumber: 5, title: 'Neural Networks & Deep Learning Intro', keyTopics: ['Perceptron', 'Backpropagation Algorithm', 'Activation Functions', 'Regularization (Dropout, L2)'], weightagePercentage: 15 },
        ],
        recommendedBooks: [
          { title: 'Pattern Recognition and Machine Learning', author: 'Christopher Bishop' },
          { title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurélien Géron' },
        ],
        order: 1,
      },
    ]);
    const [dbmsSub, tocSub, cnSub, mathSub, mlSub] = subjects;
    logger.info(`📚 Seeded ${subjects.length} engineering subjects with unit breakdowns.`);

    // 7. PYQs (Previous Year Question Papers)
    const pyqs = await PYQModel.insertMany([
      {
        title: 'DBMS End-Semester University Question Paper 2024 (With Full Solutions)',
        slug: 'dbms-end-sem-question-paper-2024-solutions',
        subjectId: dbmsSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        year: 2024,
        examType: 'End-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/dbms_2024_paper.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/dbms_2024_solutions.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        totalMarks: 70,
        durationMinutes: 150,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        viewCount: 1850,
        downloadCount: 620,
        tags: ['DBMS', 'SQL', 'Normalization', 'Transactions', '2024 Exam', 'Model Answers'],
        description: 'Comprehensive 2024 End-Sem paper with step-by-step solutions for 3NF/BCNF normalization problems, relational algebra queries, and serializability schedule tests.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'DBMS In-Semester Mid-Term Examination 2024 Paper',
        slug: 'dbms-in-sem-examination-2024-paper',
        subjectId: dbmsSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        year: 2024,
        examType: 'In-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/dbms_insem_2024.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/dbms_insem_2024_sol.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        totalMarks: 30,
        durationMinutes: 60,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        viewCount: 940,
        downloadCount: 310,
        tags: ['DBMS', 'In-Sem', 'ER Diagrams', 'SQL Queries'],
        description: 'In-sem paper covering Unit 1 & Unit 2 with ER-diagram case studies and nested SQL query problem sets.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Theory of Computation End-Semester Examination 2024 Solved Paper',
        slug: 'toc-end-sem-examination-2024-solved',
        subjectId: tocSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        year: 2024,
        examType: 'End-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/toc_2024_paper.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/toc_2024_sol.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        totalMarks: 70,
        durationMinutes: 150,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        viewCount: 1420,
        downloadCount: 480,
        tags: ['Automata', 'TOC', 'Turing Machine', 'PDA', 'DFA Design', 'Pumping Lemma'],
        description: 'Detailed solutions for DFA minimization, PDA state diagrams, CNF grammar conversions, and TM transition table constructions.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Computer Networks University Examination 2024 Solved Paper',
        slug: 'computer-networks-university-exam-2024-solved',
        subjectId: cnSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        year: 2024,
        examType: 'End-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/cn_2024_paper.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/cn_2024_sol.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        totalMarks: 70,
        durationMinutes: 150,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        viewCount: 1600,
        downloadCount: 510,
        tags: ['Computer Networks', 'Subnetting', 'TCP', 'Routing Protocols', 'CRC'],
        description: 'Complete numerical solutions for CRC calculations, variable length subnet masking (VLSM), and Dijkstra link-state routing tables.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Engineering Mathematics I 2024 University Question Paper',
        slug: 'engineering-mathematics-i-2024-solved-paper',
        subjectId: mathSub._id,
        branchId: cseBranch._id,
        semesterId: sem1._id,
        year: 2024,
        examType: 'End-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/math1_2024.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/math1_2024_sol.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        totalMarks: 70,
        durationMinutes: 150,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        viewCount: 2200,
        downloadCount: 890,
        tags: ['Maths 1', 'FE Engineering', 'Matrices', 'Partial Differentiation', 'Euler Theorem'],
        description: 'First Year Engineering Math 1 solved question paper with step-by-step calculus derivations and linear algebra proofs.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Machine Learning Algorithms 2024 End-Semester Paper',
        slug: 'machine-learning-algorithms-2024-paper',
        subjectId: mlSub._id,
        branchId: aidsBranch._id,
        semesterId: sem5._id,
        year: 2024,
        examType: 'End-Semester Examination',
        questionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/ml_2024.pdf',
        solutionPaperUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/ml_2024_sol.pdf',
        hasSolution: true,
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        totalMarks: 70,
        durationMinutes: 150,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        viewCount: 1100,
        downloadCount: 390,
        tags: ['Machine Learning', 'SVM', 'Random Forest', 'PCA', 'Backpropagation'],
        description: 'Complete ML theory questions and mathematical derivations for gradient descent and kernel SVM optimization.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`📄 Seeded ${pyqs.length} PYQ exam papers with solutions.`);

    // 8. Notes
    const notes = await NoteModel.insertMany([
      {
        title: 'DBMS Unit 3: Normalization & Functional Dependencies Master Notes',
        slug: 'dbms-unit-3-normalization-master-notes',
        subjectId: dbmsSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 3,
        unitTitle: 'Relational Database Design & Normalization',
        authorName: 'Prof. Rajesh Verma (IIT Bombay Alumni)',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/dbms_unit3_notes.pdf',
        fileSizeBytes: 4850000,
        pageCount: 32,
        isHandwritten: false,
        isFormulaSheet: false,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2350,
        downloadCount: 840,
        tags: ['Normalization', '1NF', '2NF', '3NF', 'BCNF', 'Decomposition Rules'],
        description: 'Comprehensive unit notes with 25+ solved university exam questions on finding Candidate Keys, Minimal Covers, and proving Lossless Join Decomposition.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Theory of Computation Formula Sheet & Automata Quick CheatSheet',
        slug: 'toc-formula-sheet-automata-cheatsheet',
        subjectId: tocSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 1,
        unitTitle: 'Finite Automata & Language Hierarchy',
        authorName: 'Topper Handwritten Notes',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/toc_cheatsheet.pdf',
        fileSizeBytes: 2100000,
        pageCount: 12,
        isHandwritten: true,
        isFormulaSheet: true,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 3100,
        downloadCount: 1250,
        tags: ['TOC Formula Sheet', 'Chomsky Hierarchy', 'Arden Theorem', 'Closure Properties Table'],
        description: '12-page high-yield revision cheat sheet featuring Chomsky hierarchy comparison table, closure properties matrix, and regular expression templates.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Computer Networks Subnetting & CIDR Calculation Formula Guide',
        slug: 'computer-networks-subnetting-cidr-guide',
        subjectId: cnSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 2,
        unitTitle: 'Network Layer & IP Addressing',
        authorName: 'Prof. Ananya Sen',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/cn_subnetting_guide.pdf',
        fileSizeBytes: 1850000,
        pageCount: 18,
        isHandwritten: false,
        isFormulaSheet: true,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1980,
        downloadCount: 720,
        tags: ['Subnetting', 'CIDR', 'VLSM', 'IP Address', 'Formulas'],
        description: 'Quick formula guide to solve any subnetting numerical in under 2 minutes. Includes network mask calculation shortcuts and IP range tables.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Engineering Mathematics I Formula Book & High-Yield Tricks',
        slug: 'engineering-mathematics-1-formula-handbook',
        subjectId: mathSub._id,
        branchId: cseBranch._id,
        semesterId: sem1._id,
        unitNumber: 1,
        unitTitle: 'Full Syllabus Complete Formula Handbook',
        authorName: 'Apex Offline Learning Center Faculty Team',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/math1_formulas.pdf',
        fileSizeBytes: 3400000,
        pageCount: 28,
        isHandwritten: false,
        isFormulaSheet: true,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 4200,
        downloadCount: 1850,
        tags: ['Math 1 Formula Book', 'Eigenvalues', 'Jacobians', 'Taylor Series', 'Leibnitz Theorem'],
        description: 'Official formula handbook issued to Apex offline classroom students. Covers all calculus, matrix theorems, and expansion formulas.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`📝 Seeded ${notes.length} high-yield revision notes & formula booklets.`);

    // 9. Videos
    const videos = await VideoModel.insertMany([
      {
        title: 'How to Solve Any Normalization Problem (1NF to BCNF) in 15 Minutes',
        slug: 'solve-normalization-problems-1nf-to-bcnf',
        youtubeId: 'UrYLYV7WSHM',
        videoUrl: 'https://www.youtube.com/watch?v=UrYLYV7WSHM',
        thumbnailUrl: 'https://img.youtube.com/vi/UrYLYV7WSHM/hqdefault.jpg',
        durationSeconds: 1450,
        subjectId: dbmsSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 3,
        instructorName: 'Dr. Rajesh Verma',
        timestamps: [
          { seconds: 0, label: 'Introduction & Candidate Keys Shortcut' },
          { seconds: 240, label: 'First & Second Normal Form Rules' },
          { seconds: 610, label: '3NF vs BCNF Core Distinction' },
          { seconds: 980, label: 'Live University Exam Numerical Walkthrough' },
          { seconds: 1320, label: 'Common Mistakes to Avoid' },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 3800,
        tags: ['DBMS', 'Normalization', 'BCNF', 'Exam Tricks', 'Step-by-Step'],
        description: 'Master the algorithm to find all candidate keys, decompose tables, and test for BCNF compliance with guarantee in university exams.',
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'DFA Construction & State Minimization (Myhill-Nerode & Table Filling)',
        slug: 'dfa-construction-state-minimization-toc',
        youtubeId: 'e8B3c8Wk9XQ',
        videoUrl: 'https://www.youtube.com/watch?v=e8B3c8Wk9XQ',
        thumbnailUrl: 'https://img.youtube.com/vi/e8B3c8Wk9XQ/hqdefault.jpg',
        durationSeconds: 1820,
        subjectId: tocSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 1,
        instructorName: 'Prof. Ananya Sen',
        timestamps: [
          { seconds: 0, label: 'DFA State Definition & Transition Functions' },
          { seconds: 320, label: 'Step 1: Eliminate Unreachable States' },
          { seconds: 710, label: 'Step 2: Table-Filling Algorithm Setup' },
          { seconds: 1200, label: 'Step 3: State Equivalence Partitioning' },
          { seconds: 1650, label: 'Final Minimal DFA State Diagram' },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2950,
        tags: ['TOC', 'DFA Minimization', 'Table Filling Algorithm', 'Automata'],
        description: 'Crystal clear tutorial explaining the step-by-step table filling algorithm for DFA minimization with 3 worked-out exam problems.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Subnetting Mastery: Classless Inter-Domain Routing (CIDR) Solved Examples',
        slug: 'subnetting-mastery-cidr-solved-examples',
        youtubeId: 'rs39WbegPoc',
        videoUrl: 'https://www.youtube.com/watch?v=rs39WbegPoc',
        thumbnailUrl: 'https://img.youtube.com/vi/rs39WbegPoc/hqdefault.jpg',
        durationSeconds: 1620,
        subjectId: cnSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        unitNumber: 2,
        instructorName: 'Prof. Amit Kulkarni',
        timestamps: [
          { seconds: 0, label: 'IP Header & Network vs Host Bits' },
          { seconds: 350, label: 'Understanding /24, /26, /28 Notation' },
          { seconds: 780, label: 'Calculating First & Broadcast Address' },
          { seconds: 1190, label: 'VLSM Allocation Case Study' },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2600,
        tags: ['Computer Networks', 'Subnetting', 'CIDR', 'IP Addressing'],
        description: 'Complete breakdown of subnet masking, CIDR blocks, and host capacity calculations for engineering exams and technical interviews.',
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`🎥 Seeded ${videos.length} video lectures with timestamps.`);

    // 10. Playlists / Crash Courses
    await PlaylistModel.insertMany([
      {
        title: 'DBMS Complete 5-Day University Exam Sprint Series',
        slug: 'dbms-complete-5-day-exam-sprint-series',
        subjectId: dbmsSub._id,
        branchId: cseBranch._id,
        semesterId: sem5._id,
        description: 'Fast-paced revision series covering the top 20 guaranteed scoring topics across all 5 units of Database Management Systems.',
        thumbnailUrl: 'https://img.youtube.com/vi/UrYLYV7WSHM/hqdefault.jpg',
        videoIds: [videos[0]._id],
        totalVideos: 1,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1400,
        tags: ['DBMS Crash Course', 'Exam Sprint', 'Fast Revision'],
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);

    // 11. Engineering Projects
    await ProjectModel.insertMany([
      {
        title: 'Autonomous Smart Surveillance Drone with Edge AI Person & Weapon Detection',
        slug: 'autonomous-smart-surveillance-drone-edge-ai',
        category: 'Final Year Major Project (CapStone)',
        abstract: 'An autonomous Quadcopter integrated with Raspberry Pi 4 and YOLOv8-tiny running local inference for perimeter security, real-time threat detection, and automated GPS waypoint tracking.',
        description: 'Complete engineering project documentation including 3D CAD frame models, ROS (Robot Operating System) navigation architecture, Python computer vision pipeline, and telemetry dashboard.',
        branchIds: [cseBranch._id, etcBranch._id, aidsBranch._id],
        techStack: ['Python', 'YOLOv8', 'OpenCV', 'ROS2', 'Raspberry Pi', 'FastAPI', 'React'],
        githubUrl: 'https://github.com/apex-engineering/smart-surveillance-drone',
        demoUrl: 'https://drone-ai.apexengineering.edu',
        reportPdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/drone_project_report.pdf',
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        hardwareRequired: ['Raspberry Pi 4 (8GB)', 'Pixhawk 4 Flight Controller', 'Pi Camera V2', 'F450 Quadcopter Frame', '4x 2212 920KV Brushless Motors'],
        features: [
          'Real-time edge object detection at 22 FPS',
          'Automated Return-to-Launch (RTL) fail-safe on low battery',
          'Live video stream with WebRTC latency under 120ms',
          'Interactive React dashboard with Mapbox flight logs',
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1950,
        downloadCount: 420,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Decentralized Academic Credential Verification System on Ethereum',
        slug: 'decentralized-academic-credential-verification-ethereum',
        category: 'Final Year Major Project (CapStone)',
        abstract: 'A tamper-proof digital degree and certificate issuance and verification portal powered by Solidity Smart Contracts, IPFS decentralized storage, and cryptographic zero-knowledge proofs.',
        description: 'Eliminates degree forgery by allowing universities to mint soulbound verification tokens and recruiters to instantly verify student transcripts via QR code without database queries.',
        branchIds: [cseBranch._id, itBranch._id],
        techStack: ['Solidity', 'Ethereum', 'Hardhat', 'IPFS', 'Next.js', 'Ethers.js', 'Tailwind CSS'],
        githubUrl: 'https://github.com/apex-engineering/blockchain-credentials',
        demoUrl: 'https://verify.apexengineering.edu',
        reportPdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/blockchain_project_report.pdf',
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        features: [
          'Soulbound Non-Transferable ERC-721 token minting',
          'Decentralized PDF storage with IPFS pinata redundancy',
          'Instant 1-click recruiter verification modal',
          'MetaMask wallet authentication with role-based access',
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1680,
        downloadCount: 380,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'IoT-Based Smart Energy Meter with Real-Time Power Analysis & Web Dashboard',
        slug: 'iot-smart-energy-meter-power-analysis',
        category: 'Third Year Mini Project',
        abstract: 'An ESP32-based non-invasive power monitoring meter utilizing CT sensors to calculate active power, power factor, and voltage fluctuations, transmitting telemetry via MQTT to a Node-RED dashboard.',
        description: 'Cost-effective electrical load monitoring solution designed for academic laboratories and residential power optimization with automated surge alert emails.',
        branchIds: [etcBranch._id, cseBranch._id],
        techStack: ['ESP32', 'C++', 'MQTT Protocol', 'Node-RED', 'InfluxDB', 'Grafana'],
        githubUrl: 'https://github.com/apex-engineering/iot-energy-meter',
        reportPdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/iot_meter_report.pdf',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        hardwareRequired: ['ESP32 DevKit V1', 'SCT-013-000 Non-invasive AC Current Sensor', 'ZMPT101B Voltage Sensor Module', '0.96 inch I2C OLED Display'],
        features: [
          'Calculates RMS Voltage, Current, Active Power (Watts), and kWh consumed',
          'Sub-second telemetry updates over lightweight MQTT',
          'Automated threshold alert triggers over Telegram bot',
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1340,
        downloadCount: 290,
        createdBy: editor._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`💡 Seeded engineering projects & capstone ideas.`);

    // 12. Tech & Core Engineering Jobs
    await JobModel.insertMany([
      {
        title: 'Graduate Engineer Trainee (GET) - Software Engineering',
        slug: 'graduate-engineer-trainee-software-engineering-tcs',
        companyName: 'Tata Consultancy Services (Digital Wing)',
        companyLogoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
        jobType: 'FULL_TIME',
        location: 'Pune / Bengaluru / Hyderabad',
        workMode: 'HYBRID',
        salaryOrStipend: '₹7.5 - 9.0 LPA',
        batchEligible: ['2025', '2026'],
        branchesAllowed: [cseBranch._id, itBranch._id, aidsBranch._id, etcBranch._id],
        minCgpa: 6.5,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applyUrl: 'https://careers.tcs.com/engineering-hiring',
        description: 'Hiring fresh engineering graduates for core software development, cloud infrastructure management, and AI/ML solution implementation.',
        requirements: [
          'B.E. / B.Tech in CSE, IT, AI&DS, or E&TC',
          'Strong command over Java, C++, or Python',
          'Solid understanding of Data Structures, Algorithms, DBMS, and OOP concepts',
          'No active backlogs at the time of joining',
        ],
        selectionRounds: ['Online Aptitude & Coding Assessment (TCS NQT)', 'Technical Interview', 'Managerial & HR Round'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2800,
        clickCount: 650,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Embedded Systems & Firmware Developer Intern',
        slug: 'embedded-systems-firmware-developer-intern-bosch',
        companyName: 'Bosch Global Software Technologies',
        companyLogoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
        jobType: 'INTERNSHIP',
        location: 'Bengaluru / Pune',
        workMode: 'ON_SITE',
        salaryOrStipend: '₹35,000 / month',
        batchEligible: ['2025', '2026', '2027'],
        branchesAllowed: [etcBranch._id, cseBranch._id],
        minCgpa: 7.0,
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        applyUrl: 'https://careers.bosch.com/embedded-intern',
        description: '6-month intensive internship on Automotive microcontrollers (ARM Cortex-M), CAN protocol bus, RTOS scheduling, and firmware testing.',
        requirements: [
          'Proficiency in Embedded C and Microcontroller programming',
          'Experience with communication protocols: SPI, I2C, UART, CAN',
          'Familiarity with oscilloscope and logic analyzers',
        ],
        selectionRounds: ['Embedded C Coding Test', 'Technical Interview', 'HR Screening'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1900,
        clickCount: 420,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Core Design Engineer (CAD / FEA Simulation)',
        slug: 'core-design-engineer-cad-fea-lnt',
        companyName: 'Larsen & Toubro (Heavy Engineering)',
        companyLogoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
        jobType: 'FULL_TIME',
        location: 'Mumbai / Vadodara',
        workMode: 'ON_SITE',
        salaryOrStipend: '₹6.8 - 8.5 LPA',
        batchEligible: ['2025', '2026'],
        branchesAllowed: [mechBranch._id],
        minCgpa: 6.8,
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applyUrl: 'https://careers.larsentoubro.com',
        description: 'Mechanical design opening for pressure vessels, piping systems, finite element stress analysis (FEA), and 3D SolidWorks modeling.',
        requirements: [
          'B.E. in Mechanical Engineering',
          'Proficiency in SolidWorks, AutoCAD, and ANSYS Workbench',
          'Sound knowledge of Strength of Materials and Machine Design principles',
        ],
        selectionRounds: ['Core Technical Aptitude', 'CAD Modeling Practical Test', 'Technical & HR Interview'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1450,
        clickCount: 310,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`💼 Seeded job drives & internship openings.`);

    // 13. Career Roadmaps
    await CareerResourceModel.insertMany([
      {
        title: 'The Definitive Full Stack Software Engineer Roadmap (2025 - 2026)',
        slug: 'full-stack-software-engineer-roadmap-2025',
        type: 'ROADMAP',
        domain: 'Full Stack Web Development & Cloud Systems',
        targetYearOrRole: '2nd Year to Final Year Engineering Students',
        summary: 'A structured 6-phase engineering roadmap taking you from fundamental C++/Data Structures to high-scale Next.js, Node.js microservices, Docker, and AWS deployments.',
        contentMarkdown: `# Full Stack Engineering Mastery Roadmap

This roadmap is engineered specifically for students aiming for **12+ LPA product company placements** and remote software engineering roles.

### Phase 1: CS Fundamentals & Language Mastery (Months 1-2)
- Strong grip on **TypeScript & JavaScript (ESNext)**.
- Deep dive into Memory Management, Event Loop, Promises, and Concurrency.

### Phase 2: Modern Frontend & State Architectures (Months 3-4)
- React 19 / Next.js App Router, Tailwind CSS, Radix Primitives.
- Server State with TanStack Query and Client State with Zustand.

### Phase 3: High-Performance Backend & Databases (Months 5-6)
- Express.js / Fastify with strict TypeScript.
- Relational (PostgreSQL) vs Document (MongoDB) database design, indexing, and connection pooling.

### Phase 4: System Design & Microservices (Months 7-8)
- Caching with Redis, Asynchronous job queues with BullMQ.
- Event-driven architecture with Kafka / RabbitMQ.

### Phase 5: Cloud, DevOps & CI/CD (Months 9-10)
- Containerization with Docker & Multi-stage builds.
- AWS ECS, S3, RDS, GitHub Actions automated pipelines.
`,
        recommendedCertifications: ['AWS Certified Solutions Architect Associate', 'MongoDB Certified Developer Associate'],
        toolsAndTechnologies: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'Redis', 'AWS', 'Git'],
        stages: [
          {
            stageNumber: 1,
            title: 'Foundations & Data Structures',
            description: 'Master programming syntax, time/space complexity analysis, and algorithmic patterns (Sliding Window, Two Pointers, Trees, Graphs).',
            keySkills: ['C++ / Java / Python', 'Arrays, Strings, LinkedLists', 'Recursion & Dynamic Programming', 'Git Version Control'],
            recommendedFreeResources: [
              { title: 'NeetCode 150 Problem Roadmap', url: 'https://neetcode.io' },
              { title: 'MIT 6.006 Introduction to Algorithms', url: 'https://ocw.mit.edu' },
            ],
          },
          {
            stageNumber: 2,
            title: 'Modern Frontend Engineering',
            description: 'Build responsive, accessible, high-performance user interfaces with modern React paradigms.',
            keySkills: ['React 19 & Next.js', 'Tailwind CSS', 'TanStack Query', 'Web Accessibility (a11y)'],
            recommendedFreeResources: [
              { title: 'React Official Documentation', url: 'https://react.dev' },
              { title: 'Next.js Learn Path', url: 'https://nextjs.org/learn' },
            ],
          },
          {
            stageNumber: 3,
            title: 'Scalable Backend & Cloud Architecture',
            description: 'Design robust REST APIs, authentication barriers, database indexing, and containerized deployments.',
            keySkills: ['Express.js + TypeScript', 'PostgreSQL / Mongoose', 'Argon2 Session Auth', 'Docker Containerization'],
            recommendedFreeResources: [
              { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
            ],
          },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 3400,
        downloadCount: 1100,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'GATE Computer Science & IT Complete Preparation Strategy & Book Guide',
        slug: 'gate-cs-it-complete-preparation-strategy',
        type: 'GATE_PREP',
        domain: 'GATE CS & Higher Studies (IITs / IISc / PSUs)',
        targetYearOrRole: '3rd Year & Final Year Engineering Aspirants',
        summary: 'Unit-by-unit marks distribution, recommended standard textbooks, 12-month timeline, and previous year question solving technique for Top 100 All India Rank.',
        contentMarkdown: `# Comprehensive GATE CS & IT Master Guide

GATE Computer Science requires strong conceptual clarity rather than rote memorization.

### Marks Distribution Breakdown:
- **General Aptitude:** 15 Marks (High-yielding)
- **Engineering Mathematics & Discrete Maths:** 13-15 Marks
- **Core Computer Science Subjects:** 70-72 Marks

### High-Yield Core Focus:
1. Theory of Computation & Compiler Design (12-15 Marks)
2. Database Management Systems (7-9 Marks)
3. Operating Systems & Computer Architecture (15-18 Marks)
4. Computer Networks (8-10 Marks)
5. Data Structures & Algorithms (16-20 Marks)
`,
        recommendedCertifications: ['GATE CS 2026 Qualification'],
        toolsAndTechnologies: ['Discrete Maths', 'Algorithms', 'TOC', 'DBMS', 'OS', 'CN', 'COA'],
        stages: [
          {
            stageNumber: 1,
            title: 'Mathematical Foundation & Discrete Structures',
            description: 'Propositional logic, set theory, combinatorics, graph theory, linear algebra, and probability calculus.',
            keySkills: ['Discrete Mathematics (Rosen)', 'Linear Algebra', 'Calculus'],
            recommendedFreeResources: [{ title: 'NPTEL Discrete Mathematics by Prof. Sudarshan Iyengar', url: 'https://nptel.ac.in' }],
          },
          {
            stageNumber: 2,
            title: 'Core Systems & Automata',
            description: 'Complete syllabus coverage of Automata, Compiler, DBMS, OS, and Computer Networks.',
            keySkills: ['Standard Textbooks Practice', 'GateOverflow PYQ Analysis'],
            recommendedFreeResources: [{ title: 'GateOverflow 25-Year Solved Question Papers', url: 'https://gateoverflow.in' }],
          },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2900,
        downloadCount: 950,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`🗺️ Seeded engineering career roadmaps & GATE guide.`);

    // 14. Faculty & Mentors
    const facultyMembers = await FacultyModel.insertMany([
      {
        name: 'Dr. Rajesh Verma',
        slug: 'dr-rajesh-verma',
        designation: 'Director & Chief Academic Mentor - Computer Engineering',
        qualification: 'B.Tech (NIT), M.Tech (IIT Bombay), Ph.D. (Computer Science)',
        experienceYears: 18,
        bio: 'Ex-Senior Scientist with 18+ years of experience mentoring over 15,000+ engineering graduates. Specialist in Database Systems, Distributed Computing, and GATE CS coaching.',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        specializationBranches: [cseBranch._id, itBranch._id, aidsBranch._id],
        subjectsTaught: ['Database Management Systems', 'Advanced Algorithms', 'Distributed Systems', 'Cloud Architecture'],
        achievements: [
          'Authored 3 national engineering textbooks',
          'Mentored AIR 4, AIR 11, and AIR 29 in GATE CS',
          'Former Principal Engineer at Oracle Corporation',
        ],
        studentRating: 4.96,
        studentReviewsCount: 840,
        linkedinUrl: 'https://linkedin.com/in/dr-rajesh-verma-apex',
        order: 1,
        isActive: true,
      },
      {
        name: 'Prof. Ananya Sen',
        slug: 'prof-ananya-sen',
        designation: 'Senior Faculty - Automata, Compilers & Discrete Mathematics',
        qualification: 'M.Tech (IIT Kharagpur), UGC-NET Qualified',
        experienceYears: 12,
        bio: 'Renowned for simplifying complex theoretical computing concepts like Turing Machines, NP-completeness, and Compiler Optimizations using visual memory models.',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        specializationBranches: [cseBranch._id, itBranch._id],
        subjectsTaught: ['Theory of Computation', 'Compiler Design', 'Discrete Mathematics'],
        achievements: [
          'Recipient of the "Best Engineering Educator Award 2023"',
          '100% pass record in university semester examinations for 6 consecutive years',
        ],
        studentRating: 4.92,
        studentReviewsCount: 620,
        linkedinUrl: 'https://linkedin.com/in/prof-ananya-sen',
        order: 2,
        isActive: true,
      },
      {
        name: 'Prof. Amit Kulkarni',
        slug: 'prof-amit-kulkarni',
        designation: 'Head of Networking & Cyber Systems Lab',
        qualification: 'M.Tech (COEP), CCNA & CISSP Certified',
        experienceYears: 14,
        bio: 'Hands-on network engineer who bridges academic syllabus with enterprise lab setups. Leads our offline networking hardware simulation labs.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        specializationBranches: [cseBranch._id, etcBranch._id],
        subjectsTaught: ['Computer Networks', 'Network Security', 'Operating Systems internals'],
        achievements: [
          'Consultant for Smart City Network Infrastructure',
          'Trained 2,000+ engineers now working at Cisco, Juniper, and AWS',
        ],
        studentRating: 4.88,
        studentReviewsCount: 490,
        order: 3,
        isActive: true,
      },
    ]);
    logger.info(`👨‍🏫 Seeded ${facultyMembers.length} star faculty & mentors.`);

    // 15. Offline Learning Center Courses & Live Batches
    await CourseModel.insertMany([
      {
        title: 'Offline Classroom Semester Mastery Batch (Computer Science & IT)',
        slug: 'offline-classroom-semester-mastery-cse-it',
        category: 'Semester Mastery',
        tagline: 'Comprehensive Offline Classroom Coaching with Daily Doubt Solving & Printed Formula Booklets',
        description: 'Our flagship offline classroom program held at our tech park learning center. Complete university syllabus coverage, unit-wise handwritten notes, weekly test series, and previous 10-year question solving workshops.',
        curriculum: [
          { moduleNumber: 1, title: 'Database Management Systems & SQL Lab Practice', topics: ['ER Modeling', 'Advanced SQL', 'Normalization Drills', 'ACID Transactions'], durationHours: 35 },
          { moduleNumber: 2, title: 'Theory of Computation & Automata Problem Workshops', topics: ['DFA Construction', 'Grammars', 'Pushdown Automata', 'Turing Machine Proofs'], durationHours: 35 },
          { moduleNumber: 3, title: 'Computer Networks with Real Router/Switch Simulations', topics: ['Subnetting Math', 'Routing Protocols', 'Wireshark Packet Analysis'], durationHours: 30 },
          { moduleNumber: 4, title: 'University Exam Intensive Revision & Mock Exam Marathon', topics: ['Top 50 University Questions', 'Model Paper Writing Practice', 'Score Improvement Tips'], durationHours: 20 },
        ],
        mode: COURSE_MODES.OFFLINE_CLASSROOM,
        durationMonths: 4,
        featuredImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        brochurePdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/semester_mastery_brochure.pdf',
        price: {
          original: 18000,
          discounted: 12500,
          scholarshipAvailable: true,
          scholarshipUptoPercentage: 40,
        },
        features: [
          'Air-conditioned smart classrooms with high-res interactive displays',
          'Daily 1-on-1 personalized doubt clearance with faculty in private cabins',
          'Printed physical formula booklets & unit-wise question banks provided free',
          'Weekly Sunday offline mock tests strictly modeled after university exam patterns',
          'Free access to digital resource library and video solution vault',
        ],
        targetBranches: [cseBranch._id, itBranch._id, aidsBranch._id],
        targetSemesters: [3, 4, 5, 6],
        batches: [
          {
            batchName: 'Morning Batch A (Weekday Regular)',
            startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            timing: '7:30 AM - 10:00 AM (Mon - Fri)',
            totalSeats: 35,
            availableSeats: 8,
            classroomLocation: 'Main Learning Center - Classroom 101, Tech Park Hub',
            isEnrolling: true,
          },
          {
            batchName: 'Evening Batch B (Post-College Regular)',
            startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            timing: '5:30 PM - 8:00 PM (Mon - Fri)',
            totalSeats: 35,
            availableSeats: 5,
            classroomLocation: 'Main Learning Center - Classroom 102, Tech Park Hub',
            isEnrolling: true,
          },
          {
            batchName: 'Weekend Intensive Super-Batch',
            startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            timing: '9:00 AM - 3:30 PM (Sat & Sun)',
            totalSeats: 40,
            availableSeats: 12,
            classroomLocation: 'Main Learning Center - Auditorium Hall A',
            isEnrolling: true,
          },
        ],
        facultyIds: [facultyMembers[0]._id, facultyMembers[1]._id, facultyMembers[2]._id],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        isFeatured: true,
        order: 1,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'GATE 2026 Comprehensive Offline Masterclass (Computer Science / IT)',
        slug: 'gate-2026-comprehensive-offline-masterclass-cse-it',
        category: 'GATE Comprehensive',
        tagline: '2-Year & 1-Year Comprehensive Classroom Coaching by Ex-IITians and GATE Top Rankers',
        description: 'Rigorous 600+ hours classroom training program designed to secure Top 100 All India Rank in GATE CS/IT. Includes 80+ full-length computer-based test series (CBT), printed theory modules, and personalized rank mentor allocation.',
        curriculum: [
          { moduleNumber: 1, title: 'Engineering Mathematics & Discrete Structures', topics: ['Linear Algebra', 'Calculus', 'Combinatorics', 'Graph Theory'], durationHours: 90 },
          { moduleNumber: 2, title: 'Data Structures, Algorithms & C Programming', topics: ['Asymptotics', 'Trees & Graphs', 'Dynamic Programming', 'Greedy'], durationHours: 110 },
          { moduleNumber: 3, title: 'TOC, Compiler Design & Computer Organization', topics: ['Automata', 'Grammars', 'Pipelining', 'Cache Memory'], durationHours: 120 },
          { moduleNumber: 4, title: 'Operating Systems, DBMS & Computer Networks', topics: ['Virtual Memory', 'Concurrency', 'SQL & Normalization', 'TCP/IP'], durationHours: 130 },
          { moduleNumber: 5, title: 'Test Series Analysis & All-India Mock Ranks', topics: ['CBT Exam Simulation', 'Speed & Accuracy Optimization'], durationHours: 150 },
        ],
        mode: COURSE_MODES.OFFLINE_CLASSROOM,
        durationMonths: 12,
        featuredImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
        brochurePdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/gate_2026_brochure.pdf',
        price: {
          original: 45000,
          discounted: 32000,
          scholarshipAvailable: true,
          scholarshipUptoPercentage: 50,
        },
        features: [
          '600+ hours of in-person classroom interactive lectures by Ex-IITians',
          '80+ Full-Length Computer-Based Test Series (CBT) replicating exact GATE interface',
          'Dedicated Silent Air-Conditioned Reading Library open 7:00 AM - 10:00 PM daily',
          'Personalized Mentor assigned for bi-weekly progress and accuracy tracking',
          'Printed 14-volume hardcopy standard theory & workbook set',
        ],
        targetBranches: [cseBranch._id, itBranch._id, aidsBranch._id],
        targetSemesters: [4, 5, 6, 7],
        batches: [
          {
            batchName: 'GATE 2026 Early Bird Weekend Classroom Batch',
            startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
            timing: '8:30 AM - 4:00 PM (Sat & Sun)',
            totalSeats: 45,
            availableSeats: 11,
            classroomLocation: 'Apex Learning Center - GATE Wing, Floor 2',
            isEnrolling: true,
          },
        ],
        facultyIds: [facultyMembers[0]._id, facultyMembers[1]._id],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        isFeatured: true,
        order: 2,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
      {
        title: 'Full Stack Web & Cloud Placement Bootcamp (Hands-on Lab Track)',
        slug: 'full-stack-web-cloud-placement-bootcamp',
        category: 'Placement Accelerator',
        tagline: 'Transform from College Student into Production-Ready Software Engineer (10+ Industry Projects)',
        description: 'Industry-driven offline bootcamp covering modern TypeScript, React, Next.js, Node.js microservices, Docker, PostgreSQL, and AWS. Includes 1-on-1 resume reviews and mock interviews with tech leads from Tier-1 companies.',
        curriculum: [
          { moduleNumber: 1, title: 'Data Structures & Problem Solving in C++ / Java', topics: ['LeetCode 250 Patterns', 'System Optimization'], durationHours: 50 },
          { moduleNumber: 2, title: 'Full Stack Engineering with Next.js & Node.js', topics: ['Next.js 15 App Router', 'REST & GraphQL', 'Prisma / PostgreSQL'], durationHours: 70 },
          { moduleNumber: 3, title: 'Cloud Infrastructure & DevOps', topics: ['Docker Containers', 'AWS Deployment', 'CI/CD Pipelines'], durationHours: 40 },
          { moduleNumber: 4, title: 'Mock Interviews & Placement Drives', topics: ['System Design rounds', 'Live behavioral & coding mocks'], durationHours: 30 },
        ],
        mode: COURSE_MODES.HYBRID,
        durationMonths: 5,
        featuredImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        brochurePdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/placement_bootcamp_brochure.pdf',
        price: {
          original: 28000,
          discounted: 19500,
          scholarshipAvailable: true,
          scholarshipUptoPercentage: 35,
        },
        features: [
          'Build and deploy 10+ real-world production projects to live cloud servers',
          'Weekly mock coding interviews and system design feedback sessions',
          'Direct campus drive referrals to 40+ hiring partner companies',
          'Unlimited access to high-performance developer lab workstations',
        ],
        targetBranches: [cseBranch._id, itBranch._id, aidsBranch._id, etcBranch._id],
        targetSemesters: [5, 6, 7, 8],
        batches: [
          {
            batchName: 'Placement Batch Spring 2026',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            timing: '6:30 PM - 9:00 PM (Tue, Thu, Sat)',
            totalSeats: 30,
            availableSeats: 6,
            classroomLocation: 'Apex Innovation Lab - Floor 3',
            isEnrolling: true,
          },
        ],
        facultyIds: [facultyMembers[0]._id, facultyMembers[2]._id],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        isFeatured: true,
        order: 3,
        createdBy: superAdmin._id,
        publishedBy: superAdmin._id,
      },
    ]);
    logger.info(`🏫 Seeded Offline Center Courses & Live Batches.`);

    // 16. Events & Workshops
    await EventModel.insertMany([
      {
        title: 'Offline Open House: How to Crack 15+ LPA Engineering Placements & Demo Class',
        slug: 'offline-open-house-crack-15-lpa-placements-demo',
        eventType: EVENT_TYPES.DEMO_CLASS,
        bannerImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        summary: 'Attend our live offline open house at our Tech Park center. Experience a free demo lecture with Dr. Rajesh Verma, inspect lab facilities, and receive free printed formula booklets.',
        description: 'Exclusive 3-hour offline interactive workshop for 2nd, 3rd, and final year engineering students. Gain direct insights into university exam scoring strategies and placement trends.',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        mode: 'OFFLINE_CENTER',
        venueOrLink: 'Apex Learning Center, Auditorium Hall A, Plot 42 Tech Park Boulevard, Pune',
        speakerName: 'Dr. Rajesh Verma & Ex-Google Guest Speaker',
        speakerBio: 'Director at Apex Academy and Senior Staff Engineer at Google Cloud',
        registrationOpen: true,
        registrationLimit: 80,
        registeredCount: 42,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        createdBy: superAdmin._id,
      },
      {
        title: '48-Hour National Engineering AI & Web3 Hackathon 2026',
        slug: '48-hour-national-engineering-ai-web3-hackathon',
        eventType: EVENT_TYPES.HACKATHON,
        bannerImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        summary: 'Compete in-person with 100+ top student teams across India. ₹1,50,000 cash prize pool, direct internship offers, and mentorship from startup founders.',
        description: 'Build innovative solutions across Healthcare AI, Decentralized Finance, Smart IoT Grid, and CleanTech. Food, Wi-Fi, and mentoring support provided 24/7 at the offline campus.',
        startDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        mode: 'OFFLINE_CENTER',
        venueOrLink: 'Apex Center Innovation Campus & Maker Lab',
        speakerName: 'Industry Jury Panel',
        registrationOpen: true,
        registrationLimit: 120,
        registeredCount: 78,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        createdBy: superAdmin._id,
      },
    ]);
    logger.info(`🎪 Seeded Center Events & Workshops.`);

    // 17. Announcements
    await AnnouncementModel.insertMany([
      {
        title: 'Admissions Open for Offline Semester & GATE 2026 Batches (Up to 50% Scholarship Test Available)',
        slug: 'admissions-open-offline-semester-gate-2026-scholarship',
        category: 'BATCH_UPDATE',
        content: 'Registration is now open for our new classroom batches starting next week. Book a free 2-day demo class and take the Apex Scholarship Aptitude Test to avail up to 50% fee concession.',
        priority: 'HIGH',
        bannerAlert: true,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        createdBy: superAdmin._id,
      },
      {
        title: 'University End-Semester Examination Time Table & Model Solutions Released',
        slug: 'university-end-sem-exam-time-table-solutions-released',
        category: 'EXAM_CIRCULAR',
        content: 'The official university examination schedule for Semesters 3, 5, and 7 has been announced. Check our PYQs section for solved papers and formula cheat sheets.',
        priority: 'NORMAL',
        bannerAlert: false,
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        createdBy: superAdmin._id,
      },
    ]);

    // 18. Sample Leads
    await LeadModel.insertMany([
      {
        fullName: 'Siddharth Joshi',
        email: 'siddharth.joshi@gmail.com',
        phone: '+91 98221 12345',
        collegeName: 'Pune Institute of Computer Technology (PICT)',
        branchName: 'Computer Science & Engineering',
        currentSemester: 5,
        inquiryType: 'DEMO_CLASS',
        message: 'Interested in attending the weekend demo class for Database Systems and GATE preparation.',
        status: LEAD_STATUS.NEW,
        source: 'HOMEPAGE_HERO',
      },
      {
        fullName: 'Pooja Kulkarni',
        email: 'pooja.k@gmail.com',
        phone: '+91 98450 67890',
        collegeName: 'COEP Technological University',
        branchName: 'Information Technology',
        currentSemester: 5,
        inquiryType: 'COURSE_ENROLLMENT',
        message: 'Would like details regarding offline classroom fee structure and scholarship test dates.',
        status: LEAD_STATUS.CONTACTED,
        notes: [
          {
            note: 'Spoke with student. She will visit offline center this Saturday at 11 AM for counseling.',
            authorEmail: 'admin@engineering.edu',
            createdAt: new Date(),
          },
        ],
        source: 'COURSE_PAGE',
      },
      {
        fullName: 'Rohan Deshmukh',
        email: 'rohan.deshmukh@gmail.com',
        phone: '+91 97654 32109',
        collegeName: 'Maharashtra Institute of Technology (MIT)',
        branchName: 'Electronics & Telecommunication',
        currentSemester: 6,
        inquiryType: 'CAREER_COUNSELING',
        message: 'Looking for placement training roadmap for core firmware & embedded systems companies.',
        status: LEAD_STATUS.INTERESTED,
        source: 'CAREER_HUB',
      },
    ]);
    logger.info(`📥 Seeded sample CRM student leads.`);

    // 17. Jobs & Off-Campus Hiring Drives
    const jobs = await JobModel.insertMany([
      {
        title: 'Associate, ML Data Operations',
        slug: 'amazon-associate-ml-data-operations-2026',
        companyName: 'Amazon',
        jobType: 'OFF_CAMPUS',
        location: 'Hyderabad / Chennai / Pune / Hybrid',
        workMode: 'HYBRID',
        salaryOrStipend: '₹4.5 - 7.5 LPA',
        salaryRange: '₹4.5 - 7.5 LPA',
        batchEligible: ['2024', '2025', '2026', 'Freshers & Experienced'],
        eligibility: 'Freshers & Experienced (All Engineering Batches 2024, 2025, 2026)',
        applicationDeadline: new Date('2026-12-31'),
        deadline: new Date('2026-12-31'),
        applyUrl: 'https://www.amazon.jobs/en/jobs/3134249/associate-ml-data-operations-go-ai-operations?utm_source=chatgpt.com',
        whatsappCommunityUrl: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
        description: `Amazon is hiring for the Associate, ML Data Operations role. This is a great opportunity for candidates interested in Machine Learning, Data Operations, AI and technology.

🔹 Work with machine-learning related data operations
🔹 Support data quality and annotation processes
🔹 Work with operational and technical teams
🔹 Opportunity to gain experience in a global technology company`,
        requirements: [
          'Basic understanding of Machine Learning and AI data operations',
          'Strong analytical and data annotation / quality auditing skills',
          'Effective verbal and written communication skills',
          'Proficiency in MS Excel / Google Sheets and basic computer operations',
          'Ability to work in a collaborative and fast-paced environment',
        ],
        selectionRounds: ['Online Assessment', 'Technical & Data Aptitude Test', 'HR / Operations Interview'],
        tags: ['Amazon', 'OffCampus', 'MLOps', 'Freshers2026', 'AIJobs'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1420,
        clickCount: 385,
        applicantsCount: 385,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
      {
        title: 'Graduate Software Development Engineer (SDE-1)',
        slug: 'nvidia-graduate-sde-1-pune',
        companyName: 'NVIDIA',
        jobType: 'FULL_TIME',
        location: 'Pune / Bengaluru',
        workMode: 'HYBRID',
        salaryOrStipend: '₹16 - 24 LPA',
        salaryRange: '₹16 - 24 LPA',
        batchEligible: ['2025', '2026'],
        eligibility: 'B.E. / B.Tech in CSE, IT, E&TC (Min 7.5 CGPA)',
        applicationDeadline: new Date('2026-11-30'),
        deadline: new Date('2026-11-30'),
        applyUrl: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
        whatsappCommunityUrl: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
        description: 'Design and optimize core GPU acceleration software, CUDA runtime libraries, and distributed deep learning infrastructure for next-generation AI platforms.',
        requirements: [
          'Strong proficiency in Modern C++ (17/20) and Data Structures & Algorithms',
          'Understanding of Computer Architecture, OS Internals, and Multi-threading',
          'Experience with Linux development and debugging tools (GDB, Valgrind)',
        ],
        selectionRounds: ['Coding Round (DSA)', 'Core CS Fundamentals (OS/CN/Architecture)', 'System Design', 'Managerial'],
        tags: ['NVIDIA', 'C++', 'CUDA', 'Systems', 'HighCTC'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 2310,
        clickCount: 620,
        applicantsCount: 620,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
      {
        title: 'Cloud Solutions & DevOps Engineer',
        slug: 'microsoft-cloud-devops-2026',
        companyName: 'Microsoft',
        jobType: 'FULL_TIME',
        location: 'Hyderabad / Noida / Remote',
        workMode: 'HYBRID',
        salaryOrStipend: '₹14 - 20 LPA',
        salaryRange: '₹14 - 20 LPA',
        batchEligible: ['2024', '2025', '2026'],
        eligibility: 'Engineering Graduates with strong Cloud & Networking foundation',
        applicationDeadline: new Date('2026-12-15'),
        deadline: new Date('2026-12-15'),
        applyUrl: 'https://careers.microsoft.com',
        whatsappCommunityUrl: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
        description: 'Build automated CI/CD pipelines, containerized Kubernetes microservices, and manage high-availability Azure cloud infrastructure.',
        requirements: [
          'Hands-on experience with Docker, Kubernetes, and Linux shell scripting',
          'Understanding of TCP/IP, DNS, VPC, load balancers, and network security',
          'Familiarity with Infrastructure as Code (Terraform) and Python scripting',
        ],
        selectionRounds: ['Online Assessment', 'Technical Round 1 (Cloud & Linux)', 'Technical Round 2 (Scripting)', 'Leadership Principles'],
        tags: ['Microsoft', 'Azure', 'DevOps', 'Kubernetes', 'Cloud'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 1890,
        clickCount: 490,
        applicantsCount: 490,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
      {
        title: 'Software Engineer - Campus Drive 2026',
        slug: 'tcs-digital-ninja-hiring-2026',
        companyName: 'TCS Digital & Prime',
        jobType: 'OFF_CAMPUS',
        location: 'Pan India',
        workMode: 'ON_SITE',
        salaryOrStipend: '₹7.2 - 9.0 LPA',
        salaryRange: '₹7.2 - 9.0 LPA',
        batchEligible: ['2025', '2026'],
        eligibility: 'All Engineering Branches (B.Tech / B.E.) with 60%+ in 10th, 12th & Degree',
        applicationDeadline: new Date('2026-10-31'),
        deadline: new Date('2026-10-31'),
        applyUrl: 'https://nextstep.tcs.com/campus/#/',
        whatsappCommunityUrl: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
        description: 'National Qualifier Test (TCS NQT) for Digital & Prime roles. Work on enterprise engineering, modern web applications, and AI analytics.',
        requirements: [
          'Proficiency in any one language: Python, Java, C++, or C#',
          'Aptitude, quantitative reasoning, and algorithmic problem solving',
        ],
        selectionRounds: ['TCS National Qualifier Test (NQT)', 'Technical & Coding Interview', 'HR Round'],
        tags: ['TCS', 'NQT', 'MassHiring', 'Freshers2026'],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 4200,
        clickCount: 1250,
        applicantsCount: 1250,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
    ]);
    logger.info(`💼 Seeded ${jobs.length} realistic engineering job openings and off-campus drives.`);

    // 18. Career Roadmaps & Guides
    const roadmaps = await CareerResourceModel.insertMany([
      {
        title: 'Full Stack Web Development Roadmap (MERN / Next.js)',
        slug: 'full-stack-web-development-roadmap',
        type: 'ROADMAP',
        domain: 'Full Stack Web Development',
        targetYearOrRole: '2nd to 4th Year Engineering Students & SDE Aspirants',
        summary: 'Comprehensive 4-stage roadmap covering HTML/CSS fundamentals, modern JavaScript/TypeScript, React/Next.js frontend architecture, Node.js/Express backend APIs, and AWS deployment.',
        contentMarkdown: `# Full Stack Web Development Roadmap\n\nStep-by-step master plan to build production-grade web applications and crack high-paying Full Stack SDE roles.`,
        recommendedCertifications: ['AWS Certified Solutions Architect', 'Meta Front-End Developer Professional Certificate'],
        toolsAndTechnologies: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
        stages: [
          {
            stageNumber: 1,
            title: 'Foundation: Web Fundamentals & Modern JavaScript',
            description: 'Master semantic HTML5, modern CSS flexbox/grid, responsive layouts, and ES6+ JavaScript async/await, closures, and DOM manipulation.',
            keySkills: ['HTML5', 'CSS3', 'ES6+ JavaScript', 'Git/GitHub'],
            recommendedFreeResources: [
              { title: 'MDN Web Docs JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
              { title: 'JavaScript.info Complete Reference', url: 'https://javascript.info/' },
            ],
          },
          {
            stageNumber: 2,
            title: 'Frontend Architecture: React, Next.js & State Management',
            description: 'Component lifecycles, custom hooks, Tailwind CSS design systems, server-side rendering (SSR), and state management with Zustand/Redux.',
            keySkills: ['React 19', 'Next.js 15 App Router', 'TailwindCSS', 'Zustand', 'TypeScript'],
            recommendedFreeResources: [
              { title: 'React Official Documentation', url: 'https://react.dev' },
              { title: 'Next.js 15 Documentation', url: 'https://nextjs.org/docs' },
            ],
          },
          {
            stageNumber: 3,
            title: 'Backend Systems & Database Architecture',
            description: 'RESTful API design, JWT/Session authentication, relational (PostgreSQL) and NoSQL (MongoDB) indexing, schema modeling, and caching with Redis.',
            keySkills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
            recommendedFreeResources: [
              { title: 'Node.js Design Patterns Guide', url: 'https://nodejs.org' },
              { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' },
            ],
          },
          {
            stageNumber: 4,
            title: 'DevOps, CI/CD, Containerization & Cloud Deployment',
            description: 'Docker containerization, GitHub Actions automated workflows, cloud hosting on AWS EC2/ECS/S3, and performance monitoring.',
            keySkills: ['Docker', 'GitHub Actions', 'AWS (EC2, S3)', 'Nginx', 'Vercel'],
            recommendedFreeResources: [
              { title: 'Docker for Beginners Guide', url: 'https://docker-curriculum.com/' },
              { title: 'AWS Free Tier Hands-on Workshops', url: 'https://aws.amazon.com/free/' },
            ],
          },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 3120,
        downloadCount: 840,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
      {
        title: 'Artificial Intelligence & Machine Learning Engineer Roadmap',
        slug: 'ai-machine-learning-engineer-roadmap',
        type: 'ROADMAP',
        domain: 'AI & Machine Learning',
        targetYearOrRole: 'Engineers targeting AI/ML, Data Science, and MLOps Careers',
        summary: 'From core Python and Linear Algebra / Statistics to Deep Learning (PyTorch), LLM Fine-Tuning, LangChain, and production MLOps pipeline deployment.',
        contentMarkdown: `# AI & Machine Learning Engineer Roadmap\n\nStructured pathway from core mathematical foundations to cutting-edge Generative AI and production MLOps.`,
        recommendedCertifications: ['DeepLearning.AI Deep Learning Specialization', 'TensorFlow Developer Certificate'],
        toolsAndTechnologies: ['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'PyTorch', 'HuggingFace', 'LangChain', 'FastAPI', 'MLflow'],
        stages: [
          {
            stageNumber: 1,
            title: 'Mathematical Foundations & Scientific Python',
            description: 'Linear Algebra (matrices, eigenvalues), Calculus (gradients, backprop), Probability & Statistics, NumPy, Pandas, and data visualization.',
            keySkills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Linear Algebra', 'Statistics'],
            recommendedFreeResources: [
              { title: '3Blue1Brown Essence of Linear Algebra', url: 'https://www.3blue1brown.com/' },
              { title: 'StatQuest Machine Learning Basics', url: 'https://statquest.org/' },
            ],
          },
          {
            stageNumber: 2,
            title: 'Classical Machine Learning & Feature Engineering',
            description: 'Supervised vs unsupervised algorithms: Regression, Decision Trees, Random Forests, XGBoost, Clustering, Cross-validation, and Scikit-Learn.',
            keySkills: ['Scikit-Learn', 'XGBoost', 'Feature Engineering', 'Hyperparameter Tuning'],
            recommendedFreeResources: [
              { title: 'Scikit-Learn Official User Guide', url: 'https://scikit-learn.org/' },
            ],
          },
          {
            stageNumber: 3,
            title: 'Deep Learning & Neural Architectures with PyTorch',
            description: 'Multi-layer perceptrons, CNNs for Computer Vision, RNNs/Transformers for NLP, PyTorch training pipelines, loss functions, and optimizers.',
            keySkills: ['PyTorch', 'Transformers', 'CNNs', 'Transfer Learning', 'HuggingFace'],
            recommendedFreeResources: [
              { title: 'PyTorch Official Deep Learning Tutorials', url: 'https://pytorch.org/tutorials/' },
              { title: 'HuggingFace NLP Course', url: 'https://huggingface.co/course' },
            ],
          },
          {
            stageNumber: 4,
            title: 'Generative AI, LLMs & Production MLOps',
            description: 'Fine-tuning LLMs, RAG (Retrieval Augmented Generation) with Vector DBs, LangChain/LlamaIndex, model serving with FastAPI, and Dockerized MLOps.',
            keySkills: ['LangChain', 'ChromaDB / Pinecone', 'RAG Pipelines', 'FastAPI', 'MLflow', 'Docker'],
            recommendedFreeResources: [
              { title: 'DeepLearning.AI Short Courses on LLMs', url: 'https://www.deeplearning.ai/' },
            ],
          },
        ],
        status: PUBLISHING_STATUS.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 4500,
        downloadCount: 1290,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      },
    ]);
    logger.info(`🗺️ Seeded ${roadmaps.length} comprehensive career roadmaps.`);

    // 19. Platform Configuration Settings
    await SettingModel.create({
      key: 'PLATFORM_CONFIG',
      siteName: 'Apex Engineering Academy & Digital Resource Hub',
      tagline: 'Premier Offline Classroom Coaching & Free Digital Academic Portal for Engineers',
      heroHeadline: 'Master Your Engineering Degree. Crack High-Paying Placements.',
      heroSubheadline: 'Join our elite offline classroom coaching with Ex-IITian faculty in Pune, and access free university PYQs, handwritten notes, video lectures, and career roadmaps.',
      offlineCenter: {
        name: 'Apex Engineering Learning Center',
        address: 'Plot 42, Education Hub, Tech Park Boulevard, Near IT Circle',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        contactPhone: '+91 98765 43210',
        helplinePhone: '+91 98765 43211',
        counselingEmail: 'admissions@apexengineering.edu',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2798935402636!2d73.8567!3d18.5204',
        visitingHours: 'Monday - Saturday: 7:30 AM - 8:30 PM | Sunday: 8:00 AM - 3:00 PM',
        features: [
          'Air-conditioned smart classrooms with high-res interactive displays',
          'High-performance IoT & computing hardware laboratory',
          'Private 1-on-1 personalized doubt clearance cabins with faculty',
          'Silent engineering reference library with 2,000+ textbook titles',
          'Dedicated placement & mock interview assessment cell',
          'High-speed campus Wi-Fi and power-backup reading rooms',
        ],
      },
      socialLinks: {
        youtube: 'https://youtube.com/@apexengineering',
        telegram: 'https://t.me/apexengineering',
        instagram: 'https://instagram.com/apexengineering',
        linkedin: 'https://linkedin.com/company/apexengineering',
        whatsapp: 'https://wa.me/919876543210',
      },
      topBanner: {
        isActive: true,
        text: '🎯 Admissions Open for Offline Semester & GATE 2026 Batches! Avail up to 50% Scholarship.',
        actionLabel: 'Book Free Demo Class',
        actionUrl: '/contact',
      },
      seoDefaults: {
        metaTitle: 'Apex Engineering Academy | Notes, PYQs, Syllabus & Offline Coaching',
        metaDescription: 'Free university previous year question papers (PYQs), topper handwritten notes, crash courses, and top-tier offline classroom coaching in Pune.',
        keywords: ['engineering notes', 'pyq papers', 'engineering syllabus', 'offline coaching', 'gate preparation', 'semester tuition pune'],
        ogImageUrl: '/images/og-cover.png',
      },
    });
    logger.info(`⚙️ Seeded platform settings and offline center specifications.`);

    logger.info('🎉 Database seeding completed successfully!');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during seeding:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

runSeed();
