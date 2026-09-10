'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Send,
  Target,
  Award,
  Code2,
  Cpu,
  Database,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { submitLead } from '@/lib/api';

export function CareerAssessmentWidget({ onLeadSubmitted }: { onLeadSubmitted?: () => void }) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branchName: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year (TE)',
    collegeName: '',
  });

  // Interest Ratings (1 - 5)
  const [preferences, setPreferences] = useState({
    coding: 4,
    mathematics: 4,
    hardware: 2,
    systemsDesign: 3,
    dataAnalysis: 4,
    research: 3,
    coreEngineering: 1,
    govExams: 2,
  });

  // Goals & Level
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<'Placement' | 'Internship' | 'Higher Studies' | 'GATE / PSU' | 'Career Switch'>('Placement');
  const [targetSalary, setTargetSalary] = useState('₹10 - 18 LPA');

  // Submission / Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSavedLead, setHasSavedLead] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate dynamic career fitment scores based on answers
  const calculateMatches = () => {
    const { coding, mathematics, hardware, systemsDesign, dataAnalysis, research, coreEngineering, govExams } = preferences;

    const aiScore = Math.min(98, Math.round(coding * 9 + mathematics * 9 + dataAnalysis * 5 + research * 4));
    const sdeScore = Math.min(96, Math.round(coding * 12 + systemsDesign * 7 + mathematics * 4));
    const cloudScore = Math.min(94, Math.round(coding * 7 + systemsDesign * 10 + hardware * 3 + dataAnalysis * 3));
    const dataScore = Math.min(95, Math.round(dataAnalysis * 12 + mathematics * 8 + coding * 4));
    const gateScore = Math.min(96, Math.round(govExams * 12 + mathematics * 8 + research * 4));
    const embeddedScore = Math.min(95, Math.round(hardware * 12 + coding * 6 + systemsDesign * 5));
    const coreScore = Math.min(94, Math.round(coreEngineering * 12 + mathematics * 5 + hardware * 5));

    const matches = [
      {
        title: 'AI & Machine Learning Engineer',
        score: aiScore,
        category: 'Software & AI',
        skills: ['Python', 'PyTorch', 'Linear Algebra', 'FastAPI', 'LLM Engineering'],
        roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
        projects: ['Autonomous Object Tracker with PyTorch', 'RAG Question-Answering Bot with LangChain'],
        certifications: ['DeepLearning.AI TensorFlow Specialization', 'AWS Machine Learning Specialty'],
        icon: Brain,
      },
      {
        title: 'Full Stack & Software Engineer',
        score: sdeScore,
        category: 'Software Engineering',
        skills: ['React 19 / Next.js', 'Node.js', 'System Design', 'PostgreSQL', 'Docker'],
        roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
        projects: ['High-Concurrency E-Commerce Microservice', 'Real-Time Collaborative Code Editor'],
        certifications: ['AWS Certified Solutions Architect Associate', 'Meta Full-Stack Developer'],
        icon: Code2,
      },
      {
        title: 'Cloud & DevOps Architect',
        score: cloudScore,
        category: 'Infrastructure & Cloud',
        skills: ['Kubernetes', 'Docker', 'AWS/Azure', 'Terraform', 'CI/CD Pipelines'],
        roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
        projects: ['Multi-Region Kubernetes Ingress Setup', 'Zero-Downtime Blue-Green Deployment Engine'],
        certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS DevOps Professional'],
        icon: Database,
      },
      {
        title: 'Data Science & Analytics Specialist',
        score: dataScore,
        category: 'Data & Analytics',
        skills: ['SQL Warehousing', 'Pandas/NumPy', 'Tableau', 'Statistical Modeling', 'Spark'],
        roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
        projects: ['Customer Churn Prediction Model', 'Real-Time Financial Dashboard with Streamlit'],
        certifications: ['IBM Data Science Professional Certificate', 'Databricks Data Engineer Associate'],
        icon: Layers,
      },
      {
        title: 'GATE CS / PSU Officer Track',
        score: gateScore,
        category: 'PSU & Higher Studies',
        skills: ['Discrete Mathematics', 'Theory of Computation', 'OS & Computer Networks', 'PYQ Mastery'],
        roadmapUrl: '/careers/roadmaps/gate-cs-it-complete-preparation-strategy',
        projects: ['25-Year GATE Solved Notebook', 'Automata Visualizer Simulation'],
        certifications: ['GATE AIR Top 100 Target', 'NPTEL Elite Gold Certifications'],
        icon: Award,
      },
      {
        title: 'Electronics & Embedded Systems Engineer',
        score: embeddedScore,
        category: 'Systems & Hardware',
        skills: ['Embedded C', 'STM32 Microcontrollers', 'RTOS', 'I2C/SPI Protocols', 'Verilog'],
        roadmapUrl: '/careers',
        projects: ['IoT Smart Environmental Sensor Node', 'Custom ARM Cortex-M Firmware Driver'],
        certifications: ['ARM Accredited Engineer', 'Embedded Linux Kernel Certificate'],
        icon: Cpu,
      },
      {
        title: 'Core Mechanical / Design Specialist',
        score: coreScore,
        category: 'Core Engineering',
        skills: ['CAD/SolidWorks', 'ANSYS FEA Simulation', 'Thermodynamics', 'GD&T Standards'],
        roadmapUrl: '/careers',
        projects: ['EV Chassis Finite Element Simulation', 'Automated Material Handling Robot Design'],
        certifications: ['CSWP Certified SolidWorks Professional', 'ANSYS Mechanical Certificate'],
        icon: Building,
      },
    ];

    return matches.sort((a, b) => b.score - a.score);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.fullName || !userData.email || !userData.phone) {
      setErrorMsg('Please enter your Name, Email and WhatsApp Phone.');
      return;
    }
    setErrorMsg('');
    setCurrentStep(2);
  };

  const handleSaveAssessmentLead = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    const topMatch = calculateMatches()[0];

    try {
      await submitLead({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        collegeName: userData.collegeName || 'Not specified',
        branchName: userData.branchName,
        currentSemester: userData.yearOfStudy.includes('1st') ? 1 : userData.yearOfStudy.includes('2nd') ? 3 : userData.yearOfStudy.includes('3rd') ? 5 : 7,
        inquiryType: 'CAREER_COUNSELING',
        message: `Career Assessment Results: Top match is ${topMatch.title} (${topMatch.score}% fitment). Goal: ${primaryGoal}. Level: ${skillLevel}. Target: ${targetSalary}.`,
        source: 'CAREER_ASSESSMENT_WIDGET',
      });
      setHasSavedLead(true);
      if (onLeadSubmitted) onLeadSubmitted();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save results. Your recommendations are still ready below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const matches = calculateMatches();
  const topMatch = matches[0];
  const secondaryMatches = matches.slice(1, 4);

  return (
    <section id="assessment" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <Badge variant="primary" className="bg-purple-950/80 text-purple-300 border-purple-800">
            <Brain className="w-3.5 h-3.5 mr-1 text-purple-400" /> Interactive Diagnostic Engine
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Know Which Engineering Career Fits You
          </h2>
          <p className="text-sm text-slate-300">
            Answer a few quick questions about your branch, interests, and ambitions to calculate your career fitment scores and get a customized roadmap.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[
              { num: 1, label: 'Profile' },
              { num: 2, label: 'Interests' },
              { num: 3, label: 'Goals' },
              { num: 4, label: 'Fitment Results' },
            ].map((st) => (
              <div key={st.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    currentStep === st.num
                      ? 'bg-purple-600 text-white ring-4 ring-purple-500/20'
                      : currentStep > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {currentStep > st.num ? '✓' : st.num}
                </div>
                <span className={`text-xs hidden sm:inline-block font-medium ${currentStep === st.num ? 'text-white' : 'text-slate-400'}`}>
                  {st.label}
                </span>
                {st.num < 4 && <div className="w-6 sm:w-10 h-0.5 bg-slate-800" />}
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Card Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* ================= STEP 1: Basic Information ================= */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Step 1: Tell Us About Your Academic Profile</h3>
                <p className="text-xs text-slate-400">We use this to tailor career options suitable for your college branch and graduation year.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                  <Input
                    type="text"
                    required
                    value={userData.fullName}
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                    placeholder="e.g. Aditya Kulkarni"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp / Phone *</label>
                  <Input
                    type="tel"
                    required
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="aditya@college.edu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / Institute Name</label>
                  <Input
                    type="text"
                    value={userData.collegeName}
                    onChange={(e) => setUserData({ ...userData, collegeName: e.target.value })}
                    placeholder="e.g. COEP, PICT, MIT Pune, VIT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Engineering Branch</label>
                  <select
                    value={userData.branchName}
                    onChange={(e) => setUserData({ ...userData, branchName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="AI & Data Science">Artificial Intelligence & Data Science (AIDS)</option>
                    <option value="Electronics & Telecommunication">Electronics & Telecom (E&TC)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Other / Working Professional">Other Branch / Working Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Academic Year</label>
                  <select
                    value={userData.yearOfStudy}
                    onChange={(e) => setUserData({ ...userData, yearOfStudy: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1st Year (FE)">1st Year (First Year - FE)</option>
                    <option value="2nd Year (SE)">2nd Year (Second Year - SE)</option>
                    <option value="3rd Year (TE)">3rd Year (Third Year - TE)</option>
                    <option value="Final Year (BE)">Final Year (Fourth Year - BE)</option>
                    <option value="Recent Graduate">Recent Graduate (2024 - 2026 Batch)</option>
                    <option value="Working Professional">Working Professional (1+ Yrs Exp)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" size="lg" className="bg-purple-600 hover:bg-purple-700 font-bold">
                  Next: Rate Your Technical Interests <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          )}

          {/* ================= STEP 2: Technical Preferences ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Step 2: How Much Do You Enjoy These Areas?</h3>
                <p className="text-xs text-slate-400">Rate your natural inclination from 1 (Low) to 5 (High). This powers our fitment algorithm.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: 'coding', label: 'Coding & Algorithmic Problem Solving', desc: 'Writing code in C++, Python, Java or building web APIs', icon: Code2 },
                  { key: 'mathematics', label: 'Mathematics & Statistical Logic', desc: 'Linear algebra, probability, discrete structures, numerical optimization', icon: Brain },
                  { key: 'hardware', label: 'Hardware, Embedded Systems & Microcontrollers', desc: 'Sensors, STM32, Arduino, circuit design, robotics, IoT', icon: Cpu },
                  { key: 'systemsDesign', label: 'Large Systems & Cloud Architecture', desc: 'Servers, databases, networking, scalability, Linux, Docker', icon: Database },
                  { key: 'dataAnalysis', label: 'Data Analysis & Insights', desc: 'Extracting patterns, dashboards, SQL querying, ML models', icon: Layers },
                  { key: 'research', label: 'Academic Research & Deep Theory', desc: 'Reading whitepapers, publishing projects, M.Tech/MS path', icon: GraduationCap },
                  { key: 'coreEngineering', label: 'Core Physical Engineering', desc: '3D CAD modeling, structural stress tests, thermal analysis, thermodynamics', icon: Building },
                  { key: 'govExams', label: 'GATE, PSU & Officer Jobs', desc: 'Standard syllabus exams, government PSU job security, IIT admissions', icon: Award },
                ].map((item) => (
                  <div key={item.key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-slate-100">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                        {preferences[item.key as keyof typeof preferences]} / 5
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">{item.desc}</p>

                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, [item.key]: val })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            preferences[item.key as keyof typeof preferences] === val
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-slate-700 text-slate-300">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)} className="bg-purple-600 hover:bg-purple-700 font-bold">
                  Next: Career Goals & Target <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Goals & Level ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Step 3: Goals & Preparation Stage</h3>
                <p className="text-xs text-slate-400">Tell us what you are aiming for so we can prioritize actionable recommendations.</p>
              </div>

              {/* Skill Level Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Current Technical Proficiency Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Beginner', title: 'Beginner', desc: 'Basic syntax knowledge, starting from fundamentals' },
                    { id: 'Intermediate', title: 'Intermediate', desc: 'Built a few projects, solved basic DSA, comfortable with 1 stack' },
                    { id: 'Advanced', title: 'Advanced', desc: 'Strong DSA (150+ problems), full-stack apps or core simulation mastery' },
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setSkillLevel(lvl.id as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        skillLevel === lvl.id
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">{lvl.title}</span>
                      <span className="text-[11px] text-slate-400">{lvl.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Primary Career Milestone</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['Placement', 'Internship', 'Higher Studies', 'GATE / PSU', 'Career Switch'] as const).map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setPrimaryGoal(goal)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        primaryGoal === goal
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Compensation */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Target Annual Compensation (Desired CTC)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['₹6 - 10 LPA', '₹10 - 18 LPA', '₹18 - 30+ LPA', 'Top PSU Grade A'].map((sal) => (
                    <button
                      key={sal}
                      type="button"
                      onClick={() => setTargetSalary(sal)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer ${
                        targetSalary === sal
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {sal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-slate-700 text-slate-300">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  variant="accent"
                  onClick={() => {
                    setCurrentStep(4);
                    handleSaveAssessmentLead();
                  }}
                  className="font-bold shadow-lg shadow-amber-500/20"
                >
                  Calculate My Career Fitment Score →
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Results & Matches ================= */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              {/* Top Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 border border-purple-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                      Assessment Complete
                    </span>
                    <span className="text-xs text-purple-200">Prepared for {userData.fullName || 'Engineering Scholar'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Your Strongest Career Matches</h3>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Analyzed against current Pune tech hiring, PSU cutoffs, and your technical preferences.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="border-white/30 text-white hover:bg-white/10 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake Test
                </Button>
              </div>

              {/* #1 Top Match Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-purple-500 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                      <topMatch.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">★ Best Fit Career Path</span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white">{topMatch.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-purple-950 px-4 py-2 rounded-2xl border border-purple-700/60 shrink-0">
                    <span className="text-3xl font-black text-emerald-400">{topMatch.score}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Fitment<br />Score</span>
                  </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Recommended Skills */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="font-bold text-purple-300 uppercase tracking-wider block text-[10px]">
                      Recommended High-Yield Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topMatch.skills.map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Projects */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="font-bold text-indigo-300 uppercase tracking-wider block text-[10px]">
                      Recommended Capstone Projects
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {topMatch.projects.map((proj, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Certifications & Roadmap */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px]">
                      Target Certifications
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {topMatch.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Target timeline: <strong className="text-white">{userData.yearOfStudy}</strong> | Goal:{' '}
                    <strong className="text-white">{primaryGoal}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    {topMatch.roadmapUrl && (
                      <Link
                        href={topMatch.roadmapUrl}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700 flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" /> View Step-by-Step Roadmap
                      </Link>
                    )}
                    <a
                      href="#booking-form"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                    >
                      Book 1-on-1 Session for This Path <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Secondary Matches Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Other Strong Alternatives for You</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {secondaryMatches.map((item) => (
                    <div
                      key={item.title}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-950 border border-purple-800 text-purple-300 text-xs font-black">
                            {item.score}% Match
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mb-2">{item.title}</h5>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.roadmapUrl && (
                        <Link
                          href={item.roadmapUrl}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-3 border-t border-slate-800"
                        >
                          Explore Roadmap <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmation note */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {hasSavedLead
                    ? `Your assessment result has been registered. Our mentor will reach out on ${userData.phone} with full syllabus breakdown.`
                    : 'Get your customized formula notes and roadmap PDF sent on WhatsApp.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
