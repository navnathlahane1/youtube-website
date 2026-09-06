import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Youtube,
  Send,
  Linkedin,
  Instagram,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Offline Center Hub Card */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Apex<span className="text-blue-500">Engineering</span> Academy
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Premier offline classroom engineering coaching center in Pune, combined with an open digital repository of university previous year question papers, high-yield notes, and career roadmaps.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Offline Campus:</strong> Plot 42, Education Hub, Tech Park Boulevard, Near IT Circle, Pune - 411001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Admissions Helpline:</strong> +91 98765 43210 / +91 98765 43211
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Counseling Desk:</strong> admissions@apexengineering.edu
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Center Visiting Hours:</strong> Mon - Sat: 7:30 AM - 8:30 PM | Sun: 8:00 AM - 3:00 PM
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Academic Sitemaps */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Engineering Branches</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/academics/cse/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Computer Science (CSE) <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/academics/it/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Information Technology (IT) <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/academics/aids/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  AI & Data Science (AIDS) <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/academics/etc/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Electronics & Telecom (E&TC) <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/academics/mech/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Mechanical Engineering <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/academics/civil/5" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Civil Engineering <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Digital Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/pyqs" className="hover:text-blue-400 transition-colors">
                  University PYQ Papers (Solved)
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-blue-400 transition-colors">
                  Topper Handwritten Notes
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-blue-400 transition-colors">
                  Crash Course Video Lectures
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-blue-400 transition-colors">
                  Capstone Engineering Projects
                </Link>
              </li>
              <li>
                <Link href="/careers/roadmaps" className="hover:text-blue-400 transition-colors">
                  Developer & GATE Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/careers/jobs" className="hover:text-blue-400 transition-colors">
                  Off-Campus Drives & Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Offline Coaching & Center */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Offline Classroom Hub</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Semester Tuition Batches
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> GATE 2026 Comprehensive
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Placement Accelerator Track
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Book Free Demo Classroom
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-blue-400 transition-colors">
                  Meet Our Ex-IITian Mentors
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-blue-400 transition-colors">
                  Campus Open House Days
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} Apex Engineering Academy & Educational Trust. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300">
              Offline Center Directions
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Admission Inquiry
            </Link>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="hover:text-blue-400 font-mono">
              Admin Portal →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
