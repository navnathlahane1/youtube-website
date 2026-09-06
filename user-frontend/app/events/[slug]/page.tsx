import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, MapPin, Users, CheckCircle2, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const event = await getEventBySlug(slug);
    if (!event) return { title: 'Event Not Found' };
    return {
      title: `${event.title} | Apex Engineering Academy Pune`,
      description: event.description?.slice(0, 160) || 'Register for upcoming engineering workshop in Pune.',
    };
  } catch {
    return { title: 'Engineering Event | Apex Academy' };
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event: any = null;

  try {
    event = await getEventBySlug(slug);
  } catch {
    notFound();
  }

  if (!event) notFound();

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
          <span>/</span>
          <span className="text-text-primary">{event.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{event.mode || 'OFFLINE'} {event.category || 'WORKSHOP'}</Badge>
              {event.price === 0 || !event.price ? (
                <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
                  FREE Registration
                </span>
              ) : (
                <span className="text-xs font-bold text-text-primary">Ticket: ₹{event.price}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              {event.description}
            </p>

            {/* Event Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface border border-border">
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Date</span>
                <p className="text-sm font-bold text-text-primary mt-1">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                </p>
              </div>
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" /> Timings</span>
                <p className="text-sm font-bold text-text-primary mt-1">{event.timings || '10:00 AM - 4:00 PM'}</p>
              </div>
              <div className="p-3">
                <span className="text-xs text-text-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-danger" /> Venue</span>
                <p className="text-sm font-bold text-text-primary mt-1">{event.venue || 'FC Road Center, Pune'}</p>
              </div>
            </div>

            {/* Takeaways */}
            {event.takeaways && event.takeaways.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> What You Will Gain
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.takeaways.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-3xl bg-surface-elevated border border-border shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Reserve Your Seat</h3>
                <p className="text-xs text-text-muted mt-1">Limited classroom capacity (50 seats max)</p>
              </div>

              <form action="/api/v1/leads/submit" method="POST" className="space-y-3">
                <input type="hidden" name="inquiryType" value="EVENT_REGISTRATION" />
                <input type="hidden" name="source" value={`event-detail-${event.slug}`} />

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Tanmay Kulkarni"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted block mb-1">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Confirm Free RSVP Pass
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> Instant confirmation sent to WhatsApp & Email.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
