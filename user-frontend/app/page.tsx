import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
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

      {/* 2. Featured Offline Courses & Batches */}
      <FeaturedCourses />

      {/* 3. Why Choose Us (Offline Center Amenities & Pedigree) */}
      <WhyChooseUs />

      {/* 4. Academic Explorer (Interactive Hierarchy) */}
      <AcademicExplorer />

      {/* 5. Engineering Resources (PYQs, Notes, Videos, Projects) */}
      <FeaturedResources />

      {/* 6. Star Faculty Showcase */}
      <StarFaculty />

      {/* 7. Student Placement Results & Hall of Fame */}
      <StudentResults />

      {/* 8. Upcoming Batch Timetable */}
      <UpcomingBatches />

      {/* 9. Center Workshops & Hackathons */}
      <CenterEvents />

      {/* 10. Offline Demo Booking & Counseling CTA */}
      <LeadCaptureSection />
    </div>
  );
}
