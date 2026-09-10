import { MetadataRoute } from 'next';
import { getBranches, getSubjects, getPYQs, getNotes, getCourses } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexengineering.edu';

  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/academics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/resources`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/pyqs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/notes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/career-counselling`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/careers/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${siteUrl}/faculty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/bookmarks`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const [branchesRes, pyqsRes, notesRes, coursesRes] = await Promise.all([
      getBranches().catch(() => []),
      getPYQs({ limit: 50 }).catch(() => ({ items: [] })),
      getNotes({ limit: 50 }).catch(() => ({ items: [] })),
      getCourses().catch(() => []),
    ]);

    const branches = Array.isArray(branchesRes) ? branchesRes : [];
    branches.forEach((b: any) => {
      routes.push({
        url: `${siteUrl}/academics/${b.slug}/sem-1`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    const pyqs = pyqsRes?.items || [];
    pyqs.forEach((p: any) => {
      routes.push({
        url: `${siteUrl}/pyqs/${p.slug}`,
        lastModified: new Date(p.updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    });

    const notes = notesRes?.items || [];
    notes.forEach((n: any) => {
      routes.push({
        url: `${siteUrl}/notes/${n.slug}`,
        lastModified: new Date(n.updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    });

    const courses = Array.isArray(coursesRes) ? coursesRes : [];
    courses.forEach((c: any) => {
      routes.push({
        url: `${siteUrl}/courses/${c.slug}`,
        lastModified: new Date(c.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    });
  } catch {
    // Return base routes if backend isn't ready
  }

  return routes;
}
