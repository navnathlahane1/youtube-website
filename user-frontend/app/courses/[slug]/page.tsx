import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  GraduationCap,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  PhoneCall,
  ShieldCheck,
  Building,
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const course = await getCourseBySlug(slug);
    if (!course) return { title: 'Course Not Found' };
    return {
      title: `${course.title} | Offline Classroom Batch Pune | Apex Academy`,
      description: course.description?.slice(0, 160) || 'Comprehensive engineering classroom coaching at Pune center.',
    };
  } catch {
    return { title: 'Engineering Course | Apex Academy' };
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let course: any = null;

  try {
    course = await getCourseBySlug(slug);
  } catch {
    notFound();
  }

  if (!course) notFound();

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-text-primary">{course.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{course.mode || 'OFFLINE'} CLASSROOM</Badge>
              {course.branch?.name && <Badge variant="neutral">{course.branch.name}</Badge>}
              <span className="text-xs text-danger font-bold bg-danger/10 px-2.5 py-1 rounded-full border border-danger/20">
                {course.seatsLeft || 8} Seats Remaining for Next Batch
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              {course.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface border border-border">
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration</span>
                <p className="text-base font-bold text-text-primary mt-1">{course.durationWeeks ? `${course.durationWeeks} Weeks` : 'Semester-long'}</p>
              </div>
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Batch Size</span>
                <p className="text-base font-bold text-text-primary mt-1">35 Students</p>
              </div>
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</span>
                <p className="text-base font-bold text-text-primary mt-1">{course.location || 'FC Road, Pune'}</p>
              </div>
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Target</span>
                <p className="text-base font-bold text-text-primary mt-1">SPPU / Univ Exam</p>
              </div>
            </div>

            {/* Key Highlights */}
            {course.highlights && course.highlights.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> What Makes This Program Unique
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.highlights.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Breakdown */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" /> Course Modules & Syllabus
                </h3>
                <div className="space-y-3">
                  {course.curriculum.map((mod: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-elevated border border-border">
                      <div className="flex items-center justify-between font-semibold text-text-primary text-sm mb-1">
                        <span>Module {idx + 1}: {mod.title || mod.name || `Unit ${idx + 1}`}</span>
                        {mod.hours && <span className="text-xs text-text-muted">{mod.hours} Hours</span>}
                      </div>
                      <p className="text-xs text-text-secondary">{mod.description || mod.summary || 'Detailed practical theory and problem solving sessions.'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Enrollment Card */}
          <div className="lg:col-span-1">
            <div id="enroll" className="sticky top-24 p-6 rounded-3xl bg-surface-elevated border border-primary/30 shadow-2xl shadow-primary/10 space-y-6">
              <div>
                <span className="text-xs font-semibold text-text-muted">Batch Investment</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-text-primary">
                    ₹{course.price ? course.price.toLocaleString('en-IN') : '8,999'}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm line-through text-text-muted">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-success font-medium mt-1">
                  Includes full hardcopy study kit & PYQ bank
                </p>
              </div>

              <div className="space-y-3 text-xs text-text-secondary border-t border-b border-border py-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Next Batch Starts:</span>
                  <span className="font-semibold text-text-primary">
                    {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Every Monday'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Class Timings:</span>
                  <span className="font-semibold text-text-primary">{course.timings || 'Morning / Evening Batches'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Mode:</span>
                  <span className="font-semibold text-primary">{course.mode} Classroom</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Center:</span>
                  <span className="font-semibold text-text-primary">FC Road Center, Pune</span>
                </div>
              </div>

              {/* Inquiry Form */}
              <form action="/api/v1/leads/submit" method="POST" className="space-y-3">
                <input type="hidden" name="interestedCourseId" value={course._id} />
                <input type="hidden" name="inquiryType" value="COURSE_ENROLLMENT" />
                <input type="hidden" name="source" value={`course-detail-${course.slug}`} />

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Atharva Joshi"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">College & Branch</label>
                  <input
                    type="text"
                    name="collegeName"
                    placeholder="e.g. COEP / PICT - Computer"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Book Free 2-Day Demo Class
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> No payment required upfront. Attend 2 free classes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
