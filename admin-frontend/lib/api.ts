const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchAdminApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Get token if stored in localStorage
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('admin_token') || '';
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // send httpOnly cookies
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Admin API failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

// 1. Auth & Admin Management
export const adminLogin = (data: { email: string; password: string }) =>
  fetchAdminApi('/auth/login', { method: 'POST', body: JSON.stringify(data) });

export const adminLogout = () =>
  fetchAdminApi('/auth/logout', { method: 'POST' });

export const getAdminMe = () =>
  fetchAdminApi('/auth/me');

export const getAdminList = () =>
  fetchAdminApi('/admins');

export const createAdmin = (data: any) =>
  fetchAdminApi('/admins', { method: 'POST', body: JSON.stringify(data) });

// 2. Academic Hierarchy
export const getAcademicYears = () => fetchAdminApi('/academic-years');
export const createAcademicYear = (data: any) => fetchAdminApi('/academic-years', { method: 'POST', body: JSON.stringify(data) });
export const updateAcademicYear = (id: string, data: any) => fetchAdminApi(`/academic-years/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAcademicYear = (id: string) => fetchAdminApi(`/academic-years/${id}`, { method: 'DELETE' });

export const getBranches = () => fetchAdminApi('/branches');
export const createBranch = (data: any) => fetchAdminApi('/branches', { method: 'POST', body: JSON.stringify(data) });
export const updateBranch = (id: string, data: any) => fetchAdminApi(`/branches/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBranch = (id: string) => fetchAdminApi(`/branches/${id}`, { method: 'DELETE' });

export const getSemesters = (academicYearId?: string) =>
  fetchAdminApi(`/semesters${academicYearId ? `?academicYearId=${academicYearId}` : ''}`);
export const createSemester = (data: any) => fetchAdminApi('/semesters', { method: 'POST', body: JSON.stringify(data) });
export const updateSemester = (id: string, data: any) => fetchAdminApi(`/semesters/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSemester = (id: string) => fetchAdminApi(`/semesters/${id}`, { method: 'DELETE' });

export const getSubjects = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/subjects?${query.toString()}`);
};
export const createSubject = (data: any) => fetchAdminApi('/subjects', { method: 'POST', body: JSON.stringify(data) });
export const updateSubject = (id: string, data: any) => fetchAdminApi(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubject = (id: string) => fetchAdminApi(`/subjects/${id}`, { method: 'DELETE' });

// 3. Resources (PYQs, Notes, Videos, Playlists, Projects)
export const getPYQs = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/pyqs?${query.toString()}`);
};
export const createPYQ = (data: any) => fetchAdminApi('/pyqs', { method: 'POST', body: JSON.stringify(data) });
export const updatePYQ = (id: string, data: any) => fetchAdminApi(`/pyqs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePYQ = (id: string) => fetchAdminApi(`/pyqs/${id}`, { method: 'DELETE' });
export const updatePYQStatus = (id: string, status: string) => fetchAdminApi(`/pyqs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const getNotes = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/notes?${query.toString()}`);
};
export const createNote = (data: any) => fetchAdminApi('/notes', { method: 'POST', body: JSON.stringify(data) });
export const updateNote = (id: string, data: any) => fetchAdminApi(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNote = (id: string) => fetchAdminApi(`/notes/${id}`, { method: 'DELETE' });
export const updateNoteStatus = (id: string, status: string) => fetchAdminApi(`/notes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const getVideos = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/videos?${query.toString()}`);
};
export const createVideo = (data: any) => fetchAdminApi('/videos', { method: 'POST', body: JSON.stringify(data) });
export const updateVideo = (id: string, data: any) => fetchAdminApi(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteVideo = (id: string) => fetchAdminApi(`/videos/${id}`, { method: 'DELETE' });

export const getPlaylists = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/playlists?${query.toString()}`);
};
export const createPlaylist = (data: any) => fetchAdminApi('/playlists', { method: 'POST', body: JSON.stringify(data) });
export const updatePlaylist = (id: string, data: any) => fetchAdminApi(`/playlists/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePlaylist = (id: string) => fetchAdminApi(`/playlists/${id}`, { method: 'DELETE' });

export const getProjects = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/projects?${query.toString()}`);
};
export const createProject = (data: any) => fetchAdminApi('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: string, data: any) => fetchAdminApi(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProject = (id: string) => fetchAdminApi(`/projects/${id}`, { method: 'DELETE' });

// 4. Careers & Guidance
export const getJobs = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/jobs/admin/all?${query.toString()}`).catch(() => fetchAdminApi(`/jobs?${query.toString()}`));
};
export const createJob = (data: any) => fetchAdminApi('/jobs', { method: 'POST', body: JSON.stringify(data) });
export const updateJob = (id: string, data: any) => fetchAdminApi(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteJob = (id: string) => fetchAdminApi(`/jobs/${id}`, { method: 'DELETE' });

export const getCareerRoadmaps = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/career?${query.toString()}`);
};
export const createCareerRoadmap = (data: any) => fetchAdminApi('/career', { method: 'POST', body: JSON.stringify(data) });
export const updateCareerRoadmap = (id: string, data: any) => fetchAdminApi(`/career/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCareerRoadmap = (id: string) => fetchAdminApi(`/career/${id}`, { method: 'DELETE' });

// 5. Courses & Faculty
export const getCourses = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/courses?${query.toString()}`);
};
export const createCourse = (data: any) => fetchAdminApi('/courses', { method: 'POST', body: JSON.stringify(data) });
export const updateCourse = (id: string, data: any) => fetchAdminApi(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCourse = (id: string) => fetchAdminApi(`/courses/${id}`, { method: 'DELETE' });

export const getFaculty = (branchId?: string) =>
  fetchAdminApi(`/faculty${branchId ? `?branchId=${branchId}` : ''}`);
export const createFaculty = (data: any) => fetchAdminApi('/faculty', { method: 'POST', body: JSON.stringify(data) });
export const updateFaculty = (id: string, data: any) => fetchAdminApi(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFaculty = (id: string) => fetchAdminApi(`/faculty/${id}`, { method: 'DELETE' });

// 6. Leads CRM
export const getLeads = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/leads?${query.toString()}`);
};
export const updateLead = (id: string, data: any) => fetchAdminApi(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteLead = (id: string) => fetchAdminApi(`/leads/${id}`, { method: 'DELETE' });

// 7. Events & Announcements
export const getEvents = (upcomingOnly = false) => fetchAdminApi(`/events?upcoming=${upcomingOnly}`);
export const createEvent = (data: any) => fetchAdminApi('/events', { method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (id: string, data: any) => fetchAdminApi(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEvent = (id: string) => fetchAdminApi(`/events/${id}`, { method: 'DELETE' });

export const getAnnouncements = (category?: string) => fetchAdminApi(`/announcements${category ? `?category=${category}` : ''}`);
export const createAnnouncement = (data: any) => fetchAdminApi('/announcements', { method: 'POST', body: JSON.stringify(data) });
export const updateAnnouncement = (id: string, data: any) => fetchAdminApi(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAnnouncement = (id: string) => fetchAdminApi(`/announcements/${id}`, { method: 'DELETE' });

// 8. Media & Uploads
export const getMediaSignature = (params: { folder?: string } = {}) =>
  fetchAdminApi('/media/upload-signature', { method: 'POST', body: JSON.stringify(params) });

export const uploadFileDirect = async (file: File, folder = 'engineering_portal') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('admin_token') || '';
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'File upload failed');
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
};

export const getMediaAssets = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/media?${query.toString()}`);
};

export const deleteAsset = (id: string) => fetchAdminApi(`/media/${id}`, { method: 'DELETE' });

// 9. Analytics & Dashboard Metrics
export const getDashboardAnalytics = () => fetchAdminApi('/analytics/dashboard');

// 10. Audit Logs & Settings
export const getAuditLogs = (params: any = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.append(k, String(v));
  });
  return fetchAdminApi(`/audit-logs?${query.toString()}`);
};

export const getSettings = () => fetchAdminApi('/settings');
export const updateSettings = (data: any) => fetchAdminApi('/settings', { method: 'PUT', body: JSON.stringify(data) });
