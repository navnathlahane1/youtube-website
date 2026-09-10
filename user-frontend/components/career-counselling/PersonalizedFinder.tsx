'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  ExternalLink,
  Target,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function PersonalizedFinder() {
  const [branch, setBranch] = useState('CSE / IT');
  const [year, setYear] = useState('3rd Year (TE)');
  const [cgpa, setCgpa] = useState('8.0 - 9.0 CGPA');
  const [goal, setGoal] = useState('Product Placements (12+ LPA)');

  // Dynamic recommendations lookup
  const getRecommendation = () => {
    if (goal.includes('GATE') || goal.includes('PSU')) {
      return {
        title: 'GATE & PSU Top 100 Rank Accelerator',
        track: 'Higher Studies & Maharatna PSU Recruitment',
        primarySkills: ['Discrete Mathematics', 'Theory of Computation', 'OS & Computer Architecture', 'PYQs 2000-2025'],
        roadmapUrl: '/careers/roadmaps/gate-cs-it-complete-preparation-strategy',
        expectedCtc: '₹14 - 22 LPA (CTC + Officer Perks)',
        certifications: ['GATE CS / DA 2026', 'NPTEL Elite Gold'],
        timeline: '10 - 12 Months Structured Revision',
      };
    }

    if (branch === 'Mechanical' || branch === 'Civil') {
      return {
        title: 'Core Design, Automation & Simulation Track',
        track: 'Core Industry Engineering & R&D',
        primarySkills: ['ANSYS / FEA Stress Simulation', 'AutoCAD & SolidWorks / Revit', 'Thermodynamics / Structural Design', 'GD&T Standards'],
        roadmapUrl: '/careers',
        expectedCtc: '₹6 - 15 LPA',
        certifications: ['Certified SolidWorks Professional (CSWP)', 'ANSYS Structural Associate'],
        timeline: '6 - 8 Months Portfolio Building',
      };
    }

    if (goal.includes('AI') || branch.includes('AI')) {
      return {
        title: 'Applied AI & Machine Learning Engineer',
        track: 'AI/ML & Deep Learning Systems',
        primarySkills: ['Python & PyTorch', 'Linear Algebra & Statistics', 'LLM Engineering & RAG', 'FastAPI & Docker'],
        roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
        expectedCtc: '₹10 - 26 LPA',
        certifications: ['DeepLearning.AI PyTorch', 'AWS Certified Machine Learning'],
        timeline: '6 - 9 Months Project Pipeline',
      };
    }

    return {
      title: 'Full Stack & Tier-1 Software Engineer',
      track: 'Product-Based Software & Cloud Systems',
      primarySkills: ['Data Structures & Algorithms', 'React 19 / Next.js', 'Node.js / Go', 'PostgreSQL & Docker', 'System Design'],
      roadmapUrl: '/careers/roadmaps/full-stack-software-engineer-roadmap-2025',
      expectedCtc: '₹9 - 24 LPA',
      certifications: ['AWS Certified Solutions Architect', 'Meta Full-Stack Developer'],
      timeline: '4 - 6 Months Sprint to Placements',
    };
  };

  const rec = getRecommendation();

  return (
    <section id="recommendations" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="primary" className="bg-purple-950/80 text-purple-300 border-purple-800">
            <Target className="w-3.5 h-3.5 mr-1 text-purple-400" /> Instant Path Explorer
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Get Personalized Career Recommendations
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Select your parameters to instantly generate a tailored tech stack, projected compensation range, and learning roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Controls Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Your Academic Parameters
            </h3>

            {/* Branch Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="CSE / IT">Computer Science / IT (CSE/IT)</option>
                <option value="AI & DS">Artificial Intelligence & Data Science (AIDS)</option>
                <option value="E&TC">Electronics & Telecommunication (E&TC)</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            {/* Year Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1st Year (FE)">1st Year (First Year - FE)</option>
                <option value="2nd Year (SE)">2nd Year (Second Year - SE)</option>
                <option value="3rd Year (TE)">3rd Year (Third Year - TE)</option>
                <option value="Final Year (BE)">Final Year (Fourth Year - BE)</option>
                <option value="Graduate / Pro">Recent Graduate / Working Professional</option>
              </select>
            </div>

            {/* CGPA Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current CGPA / Percentage Range</label>
              <select
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="9.0+ CGPA">9.0+ CGPA (Distinction Tier)</option>
                <option value="8.0 - 9.0 CGPA">8.0 - 9.0 CGPA (First Class with Distinction)</option>
                <option value="7.0 - 8.0 CGPA">7.0 - 8.0 CGPA (First Class)</option>
                <option value="Below 7.0 / Backlogs">Below 7.0 CGPA / Cleared Backlogs</option>
              </select>
            </div>

            {/* Career Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Career Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Product Placements (12+ LPA)">Product-Based Software Placements (Tier-1)</option>
                <option value="AI & ML Specialization">AI / Machine Learning Engineer</option>
                <option value="GATE / PSU Exams">GATE Examination (Top 100 AIR / Maharatna PSUs)</option>
                <option value="Core Engineering R&D">Core Engineering & Manufacturing Design</option>
                <option value="MS / Higher Studies">MS Abroad (USA / Germany) / IIT M.Tech</option>
              </select>
            </div>
          </div>

          {/* Right Dynamic Result Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-950 to-indigo-950/80 border-2 border-purple-500/50 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-600 text-white">
                  {rec.track}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  Avg Package: {rec.expectedCtc}
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-black text-white mb-2">{rec.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Tailored for <strong className="text-purple-300">{branch}</strong> students in{' '}
                <strong className="text-purple-300">{year}</strong> targeting {goal}.
              </p>

              {/* Skills and Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="font-bold text-purple-400 uppercase tracking-wider block text-[10px]">
                    Must-Have Tech Stack
                  </span>
                  <ul className="space-y-1 text-slate-200">
                    {rec.primarySkills.map((sk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{sk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider block text-[10px]">
                    Recommended Certifications
                  </span>
                  <ul className="space-y-1 text-slate-200">
                    {rec.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Estimated Timeline: <strong className="text-white">{rec.timeline}</strong>
              </span>

              <div className="flex items-center gap-3">
                {rec.roadmapUrl && (
                  <Link
                    href={rec.roadmapUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Explore Roadmap
                  </Link>
                )}
                <a
                  href="#booking-form"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                >
                  Book Free Mentorship Session <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
