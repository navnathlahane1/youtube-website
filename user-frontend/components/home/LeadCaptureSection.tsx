'use client';

import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { submitLead } from '@/lib/api';

export function LeadCaptureSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    branchName: 'Computer Science & Engineering',
    currentSemester: 5,
    inquiryType: 'DEMO_CLASS',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitLead({
        ...formData,
        source: 'HOMEPAGE_LEAD_SECTION',
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Submission failed. Please try again or call our helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo-booking" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Offline Center Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> Free 2-Day Classroom Demo Pass
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Experience the Classroom Energy Before Enrolling.
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Visit our Pune learning center, attend a live interactive lecture with Dr. Rajesh Verma, get your doubts cleared in person, and collect your free printed engineering formula booklet.
            </p>

            <div className="space-y-3 pt-2 text-xs md:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero obligation free 2-day demo class pass</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Take the Apex Scholarship Aptitude Test for up to 50% fee concession</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Receive free printed 10-year question bank & formula handbook</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Plot 42, Education Hub, Tech Park Boulevard, Pune - 411001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Helpline: +91 98765 43210 (7:30 AM - 8:30 PM)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-6">
            <div className="p-7 sm:p-9 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {isSuccess ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Demo Pass Reserved!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.fullName}</strong>. Our senior academic counselor will call you within 2 hours to confirm your offline batch timing and seat pass.
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
                        inquiryType: 'DEMO_CLASS',
                        message: '',
                      });
                    }}
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Book Your Free Classroom Demo</h3>
                  <p className="text-xs text-slate-400">Fill details below to receive your instant SMS & WhatsApp confirmation pass.</p>

                  {errorMsg && <p className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/50 text-xs text-rose-300">{errorMsg}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                      <Input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Siddharth Joshi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (WhatsApp) *</label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Branch</label>
                      <select
                        value={formData.branchName}
                        onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="AI & Data Science">AI & Data Science (AIDS)</option>
                        <option value="Electronics & Telecommunication">Electronics & Telecom (E&TC)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
                      <select
                        value={formData.currentSemester}
                        onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value, 10) })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institute Name</label>
                    <Input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="e.g. PICT, COEP, MIT, VIT"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Type</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DEMO_CLASS">Free 2-Day Classroom Demo Class</option>
                      <option value="COURSE_ENROLLMENT">Semester Regular / Weekend Batch</option>
                      <option value="OFFLINE_CENTER_VISIT">GATE 2026 Comprehensive Batch</option>
                      <option value="CAREER_COUNSELING">Placement Track & Career Counseling</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-lg shadow-amber-500/25 mt-2"
                  >
                    Confirm Demo Seat Reservation <Send className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No spam. Your phone number is strictly used for counseling.
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
