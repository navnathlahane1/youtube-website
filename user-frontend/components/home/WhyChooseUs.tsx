import React from 'react';
import {
  Award,
  Users2,
  Cpu,
  BookMarked,
  Laptop2,
  Briefcase,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: Award,
      title: 'Ex-IITian & University Gold Medalist Mentors',
      description: 'Learn directly from passionate engineering masters with 15+ years of teaching excellence and proven track records in university top ranks.',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      icon: Users2,
      title: 'Daily 1-on-1 Personal Doubt Cabins',
      description: 'Never leave the offline center with an unsolved numerical. Step into dedicated faculty cabins for personalized step-by-step guidance.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      icon: Laptop2,
      title: 'Air-Conditioned Smart Labs & Workstations',
      description: 'High-performance computing systems, IoT test benches, and silent reading rooms open 7:00 AM to 10:00 PM with power backup.',
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60',
    },
    {
      icon: BookMarked,
      title: 'Printed Formula Booklets & Model Answers',
      description: 'All enrolled classroom students receive hardcopy formula handbooks, 10-year question banks, and toppers model answer scripts.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      icon: Cpu,
      title: 'Computer-Based Test (CBT) Simulator',
      description: 'Practice 80+ full-length mock exams on workstations replicating the exact exam interface to maximize speed and elimination accuracy.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      icon: Briefcase,
      title: 'Placement Accelerator & Mock Technical Rounds',
      description: '10+ production-grade capstone project builds, weekly system design mocks, resume polish, and direct referrals to 40+ hiring partners.',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> The Apex Offline Advantage
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Engineering Students Choose Our Offline Learning Center
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base">
            We combine high-touch in-person classroom teaching and doubt clearance with state-of-the-art digital resources for guaranteed academic and placement success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
