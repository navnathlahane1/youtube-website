'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { submitLead } from '@/lib/api';

export function CounsellingBookingForm({ prefilledTopic }: { prefilledTopic?: string }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    branchName: 'Computer Science & Engineering',
    currentSemester: 5,
    counsellingMode: 'Pune Center (Offline)',
    guidanceTopic: prefilledTopic || 'Software Placements (Product & Tier-1)',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMsg('Please provide your Name, Email and WhatsApp Phone Number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitLead({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        collegeName: formData.collegeName || 'Not specified',
        branchName: formData.branchName,
        currentSemester: Number(formData.currentSemester),
        inquiryType: 'CAREER_COUNSELING',
        message: `Mode: ${formData.counsellingMode}. Topic: ${formData.guidanceTopic}. Note: ${formData.message || 'Standard Career Counselling Request'}`,
        source: 'CAREER_COUNSELLING_PAGE',
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit request. Please verify your connection or call our helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-form" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Trust Markers */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="primary" className="bg-purple-950/80 text-purple-300 border-purple-800">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" /> Free 1-on-1 Personalized Session
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Start With Free <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                Career Counselling
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Not sure what to do next? Connect with our senior Ex-IITian faculty mentors for clarity based on your current academic stage, university syllabus, skills, and target companies.
            </p>

            {/* Feature List */}
            <div className="space-y-3.5 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span><strong>100% Free 1-on-1 Consultation:</strong> Deep dive into your academic transcript and technical portfolio.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span><strong>Custom Semester Milestone Plan:</strong> Exactly what subjects, tech stacks, and projects to focus on.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span><strong>In-Person or Online:</strong> Visit our Pune FC Road learning center or attend a Google Meet video session.</span>
              </div>
            </div>

            {/* Center Info Footer */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>FC Road, Shivajinagar, Pune</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Helpline: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Mon - Sun: 8:00 AM - 9:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Obligation Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-6">
            <div className="p-7 sm:p-9 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {isSuccess ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Counselling Session Scheduled!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.fullName}</strong>. Our academic mentor will reach out on <strong className="text-white">{formData.phone}</strong> within 2 hours to confirm your slot time and send your personalized preparation kit.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        collegeName: '',
                        branchName: 'Computer Science & Engineering',
                        currentSemester: 5,
                        counsellingMode: 'Pune Center (Offline)',
                        guidanceTopic: 'Software Placements (Product & Tier-1)',
                        message: '',
                      });
                    }}
                    className="border-slate-700 text-slate-300"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Book Free Counselling Session</h3>
                    <p className="text-xs text-slate-400">Fill in your details to reserve your 1-on-1 slot with senior faculty.</p>
                  </div>

                  {errorMsg && (
                    <p className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-xs text-rose-300">
                      {errorMsg}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                      <Input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Yash Patil"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Phone *</label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@college.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institute</label>
                      <Input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                        placeholder="e.g. PICT, COEP, MIT"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Branch</label>
                      <select
                        value={formData.branchName}
                        onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="AI & Data Science">AI & Data Science (AIDS)</option>
                        <option value="Electronics & Telecommunication">Electronics & Telecom (E&TC)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Other">Other Branch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
                      <select
                        value={formData.currentSemester}
                        onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value, 10) })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s} ({s <= 2 ? 'FE' : s <= 4 ? 'SE' : s <= 6 ? 'TE' : 'BE'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Guidance Focus Area</label>
                      <select
                        value={formData.guidanceTopic}
                        onChange={(e) => setFormData({ ...formData, guidanceTopic: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Software Placements (Product & Tier-1)">Software Placements (Product & SDE)</option>
                        <option value="AI & Machine Learning Specialization">AI & Machine Learning Career Track</option>
                        <option value="Cloud, DevOps & Backend Engineering">Cloud & DevOps Architecture</option>
                        <option value="GATE & PSU Examination Strategy">GATE & PSU Top 100 AIR Strategy</option>
                        <option value="Core Engineering (Mech/Civil/E&TC)">Core Design & Simulation Career</option>
                        <option value="Working Professional Career Switch">Working Professional Switch (Service to Product)</option>
                        <option value="Backlogs & Semester Score Booster">Backlog Clearance & University SGPA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Mode</label>
                      <select
                        value={formData.counsellingMode}
                        onChange={(e) => setFormData({ ...formData, counsellingMode: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Pune Center (Offline)">In-Person at Pune Learning Center</option>
                        <option value="Online (Google Meet / Video)">Online (Google Meet / WhatsApp Call)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">What would you like clarity on?</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Which programming language should I master first? How to balance semester exams with placement prep?"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-lg shadow-amber-500/25 mt-2"
                  >
                    Confirm My Free Counselling Session <Send className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% Free Guidance with Senior Academic Mentors. No spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
