const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    // Next.js ISR/cache settings
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

// 1. Academics
export const getBranches = () => fetchApi('/branches');
export const getSemesters = (academicYearId?: string) =>
  fetchApi(`/semesters${academicYearId ? `?academicYearId=${academicYearId}` : ''}`);
export const getSubjects = (params: { branchId?: string; semesterId?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.branchId) query.append('branchId', params.branchId);
  if (params.semesterId) query.append('semesterId', params.semesterId);
  if (params.search) query.append('search', params.search);
  return fetchApi(`/subjects?${query.toString()}`);
};
export const getSubjectHub = (slug: string) => fetchApi(`/subjects/hub/${slug}`);

// 2. PYQs
export const getPYQs = (params: { branchId?: string; semesterId?: string; subjectId?: string; year?: number; search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/pyqs?${query.toString()}`);
};
export const getPYQBySlug = (slug: string) => fetchApi(`/pyqs/view/${slug}`);
export const trackPYQDownload = (id: string) => fetchApi(`/pyqs/download/${id}`, { method: 'POST' });

// 3. Notes
export const getNotes = (params: { branchId?: string; semesterId?: string; subjectId?: string; isHandwritten?: boolean; search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/notes?${query.toString()}`);
};
export const getNoteBySlug = (slug: string) => fetchApi(`/notes/view/${slug}`);
export const trackNoteDownload = (id: string) => fetchApi(`/notes/download/${id}`, { method: 'POST' });

// 4. Videos & Playlists
export const getVideos = (params: { branchId?: string; semesterId?: string; subjectId?: string; search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/videos?${query.toString()}`);
};
export const getVideoBySlug = (slug: string) => fetchApi(`/videos/view/${slug}`);
export const getPlaylists = (params: { branchId?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.branchId) query.append('branchId', params.branchId);
  if (params.search) query.append('search', params.search);
  return fetchApi(`/playlists?${query.toString()}`);
};
export const getPlaylistBySlug = (slug: string) => fetchApi(`/playlists/view/${slug}`);

// 5. Projects
export const getProjects = (params: { branchId?: string; category?: string; tech?: string; difficulty?: string; search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/projects?${query.toString()}`);
};
export const getProjectBySlug = (slug: string) => fetchApi(`/projects/view/${slug}`);

// 6. Careers & Jobs
export const getJobs = (params: { branchId?: string; jobType?: string; workMode?: string; search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/jobs?${query.toString()}`);
};
export const getJobBySlug = (slug: string) => fetchApi(`/jobs/view/${slug}`);
export const trackJobApply = (id: string) => fetchApi(`/jobs/apply/${id}`, { method: 'POST' });

export const getCareerRoadmaps = (params: { type?: string; domain?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.type) query.append('type', params.type);
  if (params.domain) query.append('domain', params.domain);
  if (params.search) query.append('search', params.search);
  return fetchApi(`/career?${query.toString()}`);
};
export const getCareerBySlug = (slug: string) => fetchApi(`/career/view/${slug}`);

// 7. Offline Courses & Live Batches
export const getCourses = (params: { branchId?: string; category?: string; featured?: boolean } = {}) => {
  const query = new URLSearchParams();
  if (params.branchId) query.append('branchId', params.branchId);
  if (params.category) query.append('category', params.category);
  if (params.featured) query.append('featured', 'true');
  return fetchApi(`/courses?${query.toString()}`);
};
export const getCourseBySlug = (slug: string) => fetchApi(`/courses/view/${slug}`);

// 8. Faculty & Mentors
export const getFaculty = (branchId?: string) => fetchApi(`/faculty${branchId ? `?branchId=${branchId}` : ''}`);

// 9. Events & Announcements
export const getEvents = (upcomingOnly = true) => fetchApi(`/events?upcoming=${upcomingOnly}`);
export const getEventBySlug = (slug: string) => fetchApi(`/events/view/${slug}`);
export const registerForEvent = (id: string) => fetchApi(`/events/register/${id}`, { method: 'POST' });

export const getAnnouncements = (category?: string) => fetchApi(`/announcements${category ? `?category=${category}` : ''}`);
export const getBannerAlerts = () => fetchApi('/announcements/alerts/banner');

// 10. Universal Search
export const searchUniversal = (params: { q?: string; type?: string; branchId?: string; semesterId?: string; subjectId?: string; limit?: number }) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchApi(`/search?${query.toString()}`);
};

// 11. Leads & Counseling Form Submission
export const submitLead = (data: {
  fullName: string;
  email: string;
  phone: string;
  collegeName?: string;
  branchName?: string;
  currentSemester?: number;
  interestedCourseId?: string;
  inquiryType: string;
  message?: string;
  source?: string;
}) => fetchApi('/leads/submit', { method: 'POST', body: JSON.stringify(data) });

// 12. Settings
export const getPlatformSettings = () => fetchApi('/settings');
