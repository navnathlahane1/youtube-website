import Link from 'next/link';
import { getCourses, getBranches } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, Clock, MapPin, Users, CheckCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Offline Classroom Batches & Engineering Courses | Apex Academy Pune',
  description: 'Master engineering university syllabus, GATE, and full-stack software development with hands-on offline classroom coaching at FC Road, Pune.',
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [coursesRes, branchesRes] = await Promise.all([
    getCourses({
      branchId: params.branchId,
      category: params.category,
    }).catch(() => []),
    getBranches().catch(() => []),
  ]);

  const courses = Array.isArray(coursesRes) ? coursesRes : [];
  const branches = Array.isArray(branchesRes) ? branchesRes : [];

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Classroom Courses</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Offline Learning Center • Pune
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight mb-4">
              Intensive <span className="gradient-text">Classroom Batches</span> & Skill Programs
            </h1>
            <p className="text-text-secondary text-base md:text-lg mb-6 leading-relaxed">
              Designed for SPPU / Autonomous university engineering students. Small batches of 35 students, Ex-IITian faculty, AC digital classrooms, and 100% doubt resolution.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text-secondary">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-accent" /> FC Road & Kothrud, Pune
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> 35 Students per Batch
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-success" /> 94% Distinction Record
              </div>
            </div>
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Link
            href="/courses"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              !params.branchId
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface text-text-secondary border-border hover:border-primary/40'
            }`}
          >
            All Programs
          </Link>
          {branches.map((b: any) => (
            <Link
              key={b._id}
              href={`/courses?branchId=${b._id}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                params.branchId === b._id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-text-secondary border-border hover:border-primary/40'
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {courses.map((course: any) => (
            <div
              key={course._id || course.slug}
              className="rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={course.mode === 'OFFLINE' ? 'accent' : 'primary'}>
                    {course.mode} Classroom
                  </Badge>
                  {course.seatsLeft !== undefined && (
                    <span className="text-[11px] font-bold text-danger px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20">
                      {course.seatsLeft} Seats Left
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Highlights */}
                {course.highlights && course.highlights.length > 0 && (
                  <div className="space-y-2 mb-6 p-3 rounded-xl bg-surface-elevated/60 border border-border">
                    {course.highlights.slice(0, 3).map((h: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircle className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>{course.durationWeeks ? `${course.durationWeeks} Weeks` : 'Semester Long'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-text-primary">
                    <span>₹{course.price?.toLocaleString('en-IN') || '7,999'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-elevated border-t border-border flex items-center justify-between">
                <Link
                  href={`/courses/${course.slug}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Syllabus & Batches
                </Link>
                <Link
                  href={`/courses/${course.slug}#enroll`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm inline-flex items-center gap-1"
                >
                  Enroll / Demo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full py-16 text-center text-text-muted bg-surface/50 rounded-2xl border border-dashed border-border">
              <GraduationCap className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
              <h3 className="font-bold text-text-primary text-base">No Courses Found</h3>
              <p className="text-xs mt-1">Check back for upcoming semester classroom batches.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
