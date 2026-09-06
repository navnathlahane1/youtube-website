import Link from 'next/link';
import { getFaculty } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Award, BookOpen, Star, GraduationCap, CheckCircle2, PhoneCall } from 'lucide-react';

export const metadata = {
  title: 'Distinguished Engineering Faculty & Mentors | Apex Academy',
  description: 'Learn from Ex-IITians, Subject Matter Experts, and Senior University Evaluators at Apex Engineering Academy.',
};

export default async function FacultyPage() {
  const facultyRes = await getFaculty().catch(() => []);
  const facultyList = Array.isArray(facultyRes) ? facultyRes : [];

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Faculty & Mentors</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <Badge variant="primary" className="mb-4">
              <Award className="w-3.5 h-3.5 mr-1" /> Ex-IITian & SPPU Master Mentors
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight mb-4">
              Learn from <span className="gradient-text">Top Engineering Minds</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mb-6 leading-relaxed">
              Our faculty members possess 10+ years of university curriculum mastery, paper valuation insights, and real-world industrial research experience.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> 100% Concept-First Approach</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Daily 1-on-1 Doubt Hours</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Handcrafted Formula Books</span>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facultyList.map((f: any) => (
            <div
              key={f._id}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xl">
                    {f.name?.slice(0, 2).toUpperCase() || 'FA'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span>{f.rating || 4.9} / 5.0</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-0.5">{f.name}</h3>
                <p className="text-xs font-medium text-primary mb-3">{f.designation || 'Senior Faculty Mentor'}</p>

                <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border mb-4 space-y-1.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="font-semibold text-text-primary">{f.qualifications || 'M.Tech, IIT Bombay'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{f.experienceYears ? `${f.experienceYears}+ Years Experience` : '12+ Years Teaching'}</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                  {f.bio || 'Passionate educator focused on crystal-clear core understanding, numerical problem breakdown, and university scoring techniques.'}
                </p>

                {/* Specialization Tags */}
                {f.specializations && f.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.specializations.map((spec: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-surface-elevated text-text-muted border border-border">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-text-muted">{f.studentsTrainedCount ? `${f.studentsTrainedCount}+ Mentored` : '5,000+ Students Mentored'}</span>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" /> Book 1-on-1 Guidance
                </Link>
              </div>
            </div>
          ))}

          {facultyList.length === 0 && (
            <div className="col-span-full py-16 text-center text-text-muted bg-surface/50 rounded-2xl border border-dashed border-border">
              <GraduationCap className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
              <h3 className="font-bold text-text-primary text-base">Faculty Directory</h3>
              <p className="text-xs mt-1">Visiting mentors and faculty list will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
