import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedJobsSection } from '@/components/home/FeaturedJobsSection';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { AcademicExplorer } from '@/components/home/AcademicExplorer';
import { FeaturedResources } from '@/components/home/FeaturedResources';
import { StarFaculty } from '@/components/home/StarFaculty';
import { StudentResults } from '@/components/home/StudentResults';
import { UpcomingBatches } from '@/components/home/UpcomingBatches';
import { CenterEvents } from '@/components/home/CenterEvents';
import { LeadCaptureSection } from '@/components/home/LeadCaptureSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Top Engineering Jobs & Off-Campus Hiring Hub (Live Drives) */}
      <FeaturedJobsSection />

      {/* 3. Featured Offline Courses & Batches */}
      <FeaturedCourses />

      {/* 4. Why Choose Us (Offline Center Amenities & Pedigree) */}
      <WhyChooseUs />

      {/* 5. Academic Explorer (Interactive Hierarchy) */}
      <AcademicExplorer />

      {/* 6. Engineering Resources (PYQs, Notes, Videos, Projects) */}
      <FeaturedResources />

      {/* 7. Star Faculty Showcase */}
      <StarFaculty />

      {/* 8. Student Placement Results & Hall of Fame */}
      <StudentResults />

      {/* 9. Upcoming Batch Timetable */}
      <UpcomingBatches />

      {/* 10. Center Workshops & Hackathons */}
      <CenterEvents />

      {/* 11. Offline Demo Booking & Counseling CTA */}
      <LeadCaptureSection />
    </div>
  );
}

