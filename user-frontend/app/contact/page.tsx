import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Train,
  Bus,
  ShieldCheck,
  Send,
  Building,
  GraduationCap,
} from 'lucide-react';

export const metadata = {
  title: 'Visit Pune Offline Learning Center & Contact Us | Apex Academy',
  description: 'Visit our flagship offline engineering learning center at FC Road, Pune. Book a 1-on-1 counselor guidance session or attend free demo classes.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Visit & Contact</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <Badge variant="primary" className="mb-4">
              <Building className="w-3.5 h-3.5 mr-1" /> Flagship Offline Learning Center
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight mb-4">
              Step Into Our <span className="gradient-text">Pune Learning Center</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mb-6 leading-relaxed">
              Experience air-conditioned smart digital classrooms, dedicated 24/7 study library, 1-on-1 Ex-IITian doubt cabins, and hardcopy engineering study materials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Details & Directions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
              <h2 className="text-lg font-bold text-text-primary">Center Information</h2>

              <div className="space-y-4 text-xs text-text-secondary">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">FC Road Main Center</p>
                    <p className="text-text-muted mt-0.5">
                      3rd Floor, Apex Tech Tower, Opp. Ferguson College Main Gate, FC Road, Shivajinagar, Pune - 411005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">Visiting & Inquiry Hours</p>
                    <p className="text-text-muted mt-0.5">Monday – Sunday: 8:00 AM – 9:00 PM</p>
                    <p className="text-text-muted">Library Access: 7:00 AM – 11:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">Admissions Hotline</p>
                    <p className="text-text-muted mt-0.5">+91 (020) 2553-9000</p>
                    <p className="text-text-muted">+91 98230 12345 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">Direct Email</p>
                    <p className="text-text-muted mt-0.5">admissions@apexengineering.edu</p>
                  </div>
                </div>
              </div>

              {/* Transit & Commute */}
              <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-3">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">How To Reach Us</h3>
                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Metro:</strong> Deccan Gymkhana Station (400m walk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-accent shrink-0" />
                    <span><strong>PMPML Bus:</strong> FC Road / Goodluck Chowk Stop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry / Counseling Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-surface border border-border space-y-6">
              <div>
                <Badge variant="accent" className="mb-2">1-on-1 Mentorship</Badge>
                <h2 className="text-2xl font-bold text-text-primary">Book a Free Center Visit & Counseling Session</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Meet our Ex-IITian senior faculty, evaluate previous year scoring trends for your university subjects, and inspect our classroom facilities.
                </p>
              </div>

              <form action="/api/v1/leads/submit" method="POST" className="space-y-4">
                <input type="hidden" name="inquiryType" value="CENTER_VISIT" />
                <input type="hidden" name="source" value="contact-page-form" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Yash Patil"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">WhatsApp / Mobile *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="yash@college.edu"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">Engineering College Name</label>
                    <input
                      type="text"
                      name="collegeName"
                      placeholder="e.g. COEP / MIT-WPU / PICT"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">Branch</label>
                    <input
                      type="text"
                      name="branchName"
                      placeholder="e.g. Computer / Mechanical / E&TC"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1.5">Current Semester</label>
                    <select
                      name="currentSemester"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="1">Semester 1 (FE)</option>
                      <option value="2">Semester 2 (FE)</option>
                      <option value="3">Semester 3 (SE)</option>
                      <option value="4">Semester 4 (SE)</option>
                      <option value="5">Semester 5 (TE)</option>
                      <option value="6">Semester 6 (TE)</option>
                      <option value="7">Semester 7 (BE)</option>
                      <option value="8">Semester 8 (BE)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1.5">What would you like guidance on?</label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tell us if you want classroom batches, back-log clearance guidance, GATE roadmap, or university scoring tips..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Schedule My Free Counseling Session
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                <ShieldCheck className="w-4 h-4 text-success" /> 100% Free Guidance with Senior Academic Mentors. No obligation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
