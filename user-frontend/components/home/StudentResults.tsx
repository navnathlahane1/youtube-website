import React from 'react';
import { Trophy, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function StudentResults() {
  const placements = [
    {
      studentName: 'Aarav Mehta',
      college: 'PICT Pune (CSE)',
      company: 'Microsoft',
      ctc: '₹45.5 LPA',
      role: 'Software Engineer',
      badge: 'Placement Track',
      quote: 'Apex’s offline mock interviews and daily faculty doubt clearance gave me the confidence to crack Microsoft interviews.',
    },
    {
      studentName: 'Sneha Patil',
      college: 'COEP Technological University',
      company: 'Google Cloud',
      ctc: '₹42.0 LPA',
      role: 'Cloud Solutions Engineer',
      badge: 'GATE + Coding Batch',
      quote: 'Dr. Rajesh Verma’s deep dive into Distributed Systems and operating systems internals made all the difference.',
    },
    {
      studentName: 'Rohan Deshmukh',
      college: 'VIT Pune (IT)',
      company: 'Oracle Corporation',
      ctc: '₹28.0 LPA',
      role: 'Database Kernel Engineer',
      badge: 'DBMS Mastery Batch',
      quote: 'Solved over 100+ university exam and placement questions in offline class. Secured 9.8 CGPA and dream placement.',
    },
    {
      studentName: 'Tanvi Joshi',
      college: 'MIT WPU (E&TC)',
      company: 'Qualcomm',
      ctc: '₹24.0 LPA',
      role: 'Embedded Software Engineer',
      badge: 'Core Electronics',
      quote: 'The hardware simulation lab at Apex offline center provided hands-on experience on microcontrollers and RTOS.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-3 py-1 rounded-full mb-3">
            <Trophy className="w-3.5 h-3.5 fill-amber-400" /> Placement Hall of Fame
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Our Students at Top Global Tech & Core Engineering Giants
          </h2>
          <p className="mt-3 text-slate-400 text-sm md:text-base">
            From university gold medals to ₹40+ LPA international packages, see how our classroom coaching and mentorship transforms engineering careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {placements.map((p, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-blue-500/80 shadow-xl transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                    {p.badge}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-400">{p.ctc}</span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">{p.studentName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{p.college}</p>

                <div className="mt-4 pt-3 border-t border-slate-900">
                  <div className="text-xs font-semibold text-slate-300">{p.company}</div>
                  <div className="text-[11px] text-slate-500">{p.role}</div>
                </div>

                <p className="mt-4 text-xs text-slate-400 italic leading-relaxed">
                  &ldquo;{p.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-900 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Placement Record
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
