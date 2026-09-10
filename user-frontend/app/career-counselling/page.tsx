import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getFaculty, getCareerRoadmaps } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CAREER_PATHS,
  WHY_COUNSELLING_FEATURES,
  HOW_IT_WORKS_STEPS,
} from '@/lib/career-counselling-data';
import { ComparisonTable } from '@/components/career-counselling/ComparisonTable';
import { CareerAssessmentWidget } from '@/components/career-counselling/CareerAssessmentWidget';
import { CounsellingBookingForm } from '@/components/career-counselling/CounsellingBookingForm';
import { StudentStagesSection } from '@/components/career-counselling/StudentStagesSection';
import { PersonalizedFinder } from '@/components/career-counselling/PersonalizedFinder';
import { FAQSection } from '@/components/career-counselling/FAQSection';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Target,
  Brain,
  Code2,
  Cpu,
  Layers,
  PhoneCall,
  MapPin,
  Star,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Career Counselling for Engineering Students | Apex Engineering Academy',
  description:
    'Get personalized engineering career counselling, AI career assessment, career roadmaps, placement guidance, skill recommendations, and expert mentoring from Apex Engineering Academy.',
  keywords: [
    'engineering career counselling pune',
    'free career guidance engineering',
    'ai career assessment engineering',
    'software engineer roadmap',
    'gate exam counselling',
    'apex engineering academy mentorship',
  ],
};

export default async function CareerCounsellingPage() {
  const [facultyRes, roadmapsRes] = await Promise.all([
    getFaculty().catch(() => []),
    getCareerRoadmaps().catch(() => []),
  ]);

  const facultyList = Array.isArray(facultyRes) ? facultyRes : [];
  const roadmaps = Array.isArray(roadmapsRes) ? roadmapsRes : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/careers" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Careers
          </Link>
          <span>/</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">Career Counselling</span>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1 — HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-purple-600/15 via-indigo-500/10 to-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-800 dark:text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Apex Engineering Career Counselling Hub
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
                Find the Right{' '}
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Engineering Career Path
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Personalized career counselling to help you choose the right skills, specialization, companies, exams, and semester-by-semester career roadmap.
              </p>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Whether you&apos;re a first-year engineering student, final-year student, recent graduate, or working professional, get practical guidance for your next career move.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#booking-form"
                  className="px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Get Free Career Counselling
                </a>
                <a
                  href="#career-paths"
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-purple-500" /> Explore Career Roadmaps
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Sessions
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ex-IITian Master Faculty
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pune Center & Online
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Career Fitment Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-5">
                {/* Floating header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Live Fitment Matrix</p>
                      <p className="text-[10px] text-slate-400">Engineered for 2026 Batches</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active Diagnostic
                  </span>
                </div>

                {/* Sample AI Career Matches */}
                <div className="space-y-3">
                  {[
                    { role: 'AI / ML Engineer', match: 94, branch: 'CSE / AI&DS', color: 'from-purple-500 to-indigo-600' },
                    { role: 'Full Stack SDE (Next.js & Cloud)', match: 88, branch: 'All Branches', color: 'from-blue-500 to-cyan-600' },
                    { role: 'GATE CS / PSU Officer Track', match: 82, branch: 'Engineering Degrees', color: 'from-amber-500 to-orange-600' },
                  ].map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{m.role}</span>
                        <span className="font-mono font-extrabold text-purple-600 dark:text-purple-400">{m.match}% Fit</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                          style={{ width: `${m.match}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#assessment"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5" /> Start Your Assessment Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — WHY CAREER COUNSELLING? */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="primary" className="bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              <Compass className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" /> Strategic Clarity
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Your Career Should Have a Clear Direction
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Don&apos;t navigate your 4 engineering years through guesswork. Build an intentional roadmap with experienced mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_COUNSELLING_FEATURES.map((f, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {f.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — HOW CAREER COUNSELLING WORKS */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="primary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
              <Layers className="w-3.5 h-3.5 mr-1 text-indigo-600 dark:text-indigo-400" /> 4-Step Process
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How Career Counselling Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A structured diagnostic process designed to turn confusion into confidence in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                    {step.stepNumber}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <span>Output: {step.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — CAREER OPTIONS (12 Responsive Cards) */}
      {/* ========================================================================= */}
      <section id="career-paths" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="primary" className="bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              <Compass className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" /> Engineering Trajectories
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Engineering Career Paths
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Detailed breakdown of required tech stacks, industry compensation, typical job designations, and direct roadmap links.
            </p>
          </div>

          {/* 12 Responsive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_PATHS.map((path) => (
              <div
                key={path.id}
                className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" size="sm" className="text-[10px]">
                      {path.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      {path.avgSalary}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  {/* Skills Tag Pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {path.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Roles */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Roles:</strong> {path.typicalRoles.slice(0, 2).join(', ')}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  {path.roadmapSlug ? (
                    <Link
                      href={`/careers/roadmaps/${path.roadmapSlug}`}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      Explore Path <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <a
                      href="#booking-form"
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      Get Roadmap Guidance <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}

                  <span className="text-[10px] font-mono text-slate-400">{path.demandLevel} Demand</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — FREE CAREER COUNSELLING BOOKING FORM */}
      {/* ========================================================================= */}
      <CounsellingBookingForm />

      {/* ========================================================================= */}
      {/* SECTION 6 — CAREER ASSESSMENT WIDGET */}
      {/* ========================================================================= */}
      <CareerAssessmentWidget />

      {/* ========================================================================= */}
      {/* SECTION 7 — EXPERT COUNSELLING (FACULTY & MENTORS) */}
      {/* ========================================================================= */}
      <section id="mentors" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="primary" className="bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              <Users className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" /> Master Mentors
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Talk to an Engineering Career Expert
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect directly with Ex-IITian faculty members and senior industry engineers who understand university exams, interview rounds, and career strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyList.slice(0, 3).map((f: any) => (
              <div
                key={f._id || f.slug}
                className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl">
                      {f.name?.slice(0, 2).toUpperCase() || 'EX'}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{f.studentRating || f.rating || 4.9} / 5.0</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-0.5">{f.name}</h3>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-3">{f.designation || 'Senior Academic Mentor'}</p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 mb-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{f.qualification || f.qualifications || 'M.Tech, IIT Bombay'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>{f.experienceYears ? `${f.experienceYears}+ Years Experience` : '15+ Years Mentoring'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {f.bio || 'Specialist in university scoring techniques, placement acceleration, and core engineering fundamentals.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Free 1-on-1 Session</span>
                  <a
                    href="#booking-form"
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" /> Book a Session
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — FREE VS PAID COMPARISON TABLE (REFERENCE DESIGN) */}
      {/* ========================================================================= */}
      <ComparisonTable />

      {/* ========================================================================= */}
      {/* SECTION 9 — COUNSELLING FOR DIFFERENT STUDENT STAGES */}
      {/* ========================================================================= */}
      <StudentStagesSection />

      {/* ========================================================================= */}
      {/* SECTION 10 — PERSONALIZED RECOMMENDATIONS FINDER */}
      {/* ========================================================================= */}
      <PersonalizedFinder />

      {/* ========================================================================= */}
      {/* SECTION 11 — FAQ ACCORDION (10 Questions) */}
      {/* ========================================================================= */}
      <FAQSection />

      {/* ========================================================================= */}
      {/* SECTION 12 — FINAL HIGH CONVERTING CTA */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 text-white relative overflow-hidden border-t border-purple-900/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <Badge variant="primary" className="bg-purple-900/80 text-purple-200 border-purple-700">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-300" /> Apex Career Hub
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Engineering Career <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Doesn&apos;t Need to Be a Guess
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get clarity. Build the right skills. Follow the right roadmap. Connect with our Pune faculty mentors for free 1-on-1 guidance today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#booking-form"
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Free Career Counselling <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/careers"
              className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-purple-300" /> Explore Roadmaps & Jobs
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span>✓ 100% Free Consultation</span>
            <span>•</span>
            <span>✓ FC Road, Pune Learning Center</span>
            <span>•</span>
            <span>✓ Zero Mandatory Courses</span>
          </div>
        </div>
      </section>
    </div>
  );
}
