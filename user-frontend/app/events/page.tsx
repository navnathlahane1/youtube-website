import Link from 'next/link';
import { getEvents } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, Clock, Users, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Engineering Workshops & Seminars | Apex Academy Pune',
  description: 'Hands-on hardware & software weekend bootcamps, university revision marathons, and industrial tech talks.',
};

export default async function EventsPage() {
  const eventsRes = await getEvents(false).catch(() => []);
  const events = Array.isArray(eventsRes) ? eventsRes : [];

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Events & Workshops</span>
        </nav>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Offline Learning Center Pune
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-text-primary font-display tracking-tight mb-4">
              Upcoming <span className="gradient-text">Workshops & Events</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mb-6 leading-relaxed">
              Weekend bootcamps, hands-on IoT & AI hackathons, university in-sem & end-sem revision marathons, and industry networking sessions.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {events.map((event: any) => (
            <div
              key={event._id || event.slug}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={event.mode === 'OFFLINE' ? 'primary' : 'neutral'}>
                    {event.mode} {event.category || 'WORKSHOP'}
                  </Badge>
                  {event.price === 0 || !event.price ? (
                    <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
                      FREE Entry
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-text-primary">₹{event.price}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-2">{event.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border mb-6 space-y-2 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-text-primary font-semibold">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBA'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{event.timings || '10:00 AM - 4:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{event.venue || 'FC Road Center, Pune'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  {event.registeredCount || 0} Registered
                </span>
                <Link
                  href={`/events/${event.slug}`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="col-span-full py-16 text-center text-text-muted bg-surface/50 rounded-2xl border border-dashed border-border">
              <Calendar className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
              <h3 className="font-bold text-text-primary text-base">No Upcoming Events</h3>
              <p className="text-xs mt-1">Check back next week for fresh weekend hackathons and guest lectures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
