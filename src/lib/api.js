/**
 * Resilient API fetching utilities for LINQ Corporate Website.
 * Implements a multi-stage fallback (Local -> Remote -> Static) to ensure high availability.
 */

export const REMOTE_BASE_URL = 'http://127.0.0.1:8000/api';

const isServer = typeof window === 'undefined';

import {
  DEFAULT_JOBS,
  DEFAULT_MEMBERS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_TIMELINE,
  DEFAULT_GALLERY,
  DEFAULT_VISION
} from './default-data';

/**
 * Strict Production Mode Fetch Wrapper
 * Always targets the live backend, with no local fallback.
 */
async function safeFetch(endpoint, options = {}) {
  try {
    // Add cache-buster for client-side requests
    const cacheBuster = !isServer ? `${endpoint.includes('?') ? '&' : '?'}t=${Date.now()}` : '';
    const url = `${REMOTE_BASE_URL}${endpoint}${cacheBuster}`;

    const fetchOptions = { ...options };
    if (!isServer && fetchOptions.next) delete fetchOptions.next;

    const response = await fetch(url, {
      ...fetchOptions,
      cache: !isServer ? 'no-store' : fetchOptions.cache,
      signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
    });

    if (response.ok) {
      if (response.status === 204) return { success: true };
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } else {
      console.error(`API Error: ${response.status} - ${url}`);
    }
  } catch (e) {
    console.error(`Network Error for ${REMOTE_BASE_URL}${endpoint}:`, e.message);
  }
  return null;
}

/**
 * Helper to ensure absolute media URLs by prepending the backend base.
 */
const getMediaUrl = (path) => {
  if (!path) return '';

  // If we have an absolute URL from a stale domain, strip it to force-resolve to the current backend
  const STALE_DOMAINS = [
    'https://harsh17042005.pythonanywhere.com/',
    'https://harsh17042005.pythonanywhere.com',
    'http://harsh17042005.pythonanywhere.com/',
    'http://harsh17042005.pythonanywhere.com',
    'http://127.0.0.1:8000/',
    'http://127.0.0.1:8000',
    'http://localhost:8000/',
    'http://localhost:8000'
  ];

  let cleanPath = path;
  if (typeof cleanPath === 'string') {
    STALE_DOMAINS.forEach(domain => {
      if (cleanPath.startsWith(domain)) {
        cleanPath = cleanPath.replace(domain, '');
      }
    });
  }

  if (cleanPath.startsWith('http') || cleanPath.startsWith('data:')) return cleanPath;

  // Use production backend as base for media if not absolute
  const mediaBase = REMOTE_BASE_URL.replace('/api', '');
  // Ensure we don't have double slashes if the path already starts with /media
  return `${mediaBase}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};

/**
 * Admin User Management & Authentication
 */
export const loginAdmin = (username, password) => {
  return safeFetch('/admin-users/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

export const fetchAdminUsers = () => safeFetch('/admin-users/');
export const createAdminUser = (userData) => safeFetch('/admin-users/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
export const updateAdminUser = (id, userData) => safeFetch(`/admin-users/${id}/`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
export const deleteAdminUser = (id) => safeFetch(`/admin-users/${id}/`, {
  method: 'DELETE'
});

/**
 * Fetches and formats active job openings.
 */
export async function fetchJobs() {
  const data = await safeFetch('/job-openings/', { next: { revalidate: 0 } });

  // Use fallback if API fails or returns no active jobs
  const rawJobs = (data && data.length > 0) ? data : DEFAULT_JOBS;

  return rawJobs
    .filter(j => j.status === 'Active')
    .map(j => ({
      ...j,
      jobType: j.employment_type || j.job_type || j.jobType,
      statusColor: j.status_color || j.statusColor,
      emails: Array.isArray(j.emails) ? j.emails : (j.application_email ? [j.application_email] : (j.emails ? j.emails.split(',') : [])),
      avatars: [
        `https://api.dicebear.com/7.x/notionists/svg?seed=${j.id}1`,
        `https://api.dicebear.com/7.x/notionists/svg?seed=${j.id}2`,
        `https://api.dicebear.com/7.x/notionists/svg?seed=${j.id}3`,
      ]
    }));
}

export async function fetchJobBySlug(slug) {
  const data = await safeFetch(`/job-openings/${slug}/`, { next: { revalidate: 0 } });

  if (!data) return null;

  return {
    ...data,
    jobType: data.employment_type || data.job_type,
    statusColor: data.status_color,
    emails: Array.isArray(data.emails) ? data.emails : (data.application_email ? [data.application_email] : (data.emails ? data.emails.split(',') : [])),
    avatars: [
      `https://api.dicebear.com/7.x/notionists/svg?seed=${data.id}1`,
      `https://api.dicebear.com/7.x/notionists/svg?seed=${data.id}2`,
      `https://api.dicebear.com/7.x/notionists/svg?seed=${data.id}3`,
    ]
  };
}

/**
 * Fetches and formats career growth members.
 */
export async function fetchMembers() {
  const data = await safeFetch('/career-growth-members/', { next: { revalidate: 0 } });

  // Return fallback if API fails
  const rawMembers = (data && data.length > 0) ? data : DEFAULT_MEMBERS;

  return rawMembers.map(member => ({
    ...member,
    image: getMediaUrl(member.image),
    detailedDescription: member.detailed_description || '',
    memberBgClass: member.member_bg_class || 'member-bg-primary',
    experiences: (member.experiences || []).map(exp => ({
      ...exp,
      type: exp.exp_type
    }))
  }));
}

/**
 * Fetches the Vision statement list (Admin).
 */
export async function fetchVisionList() {
  const data = await safeFetch('/vision/', { next: { revalidate: 0 } });
  return data || [];
}

/**
 * Fetches the Vision statement (Single - public).
 */
export async function fetchVision() {
  const data = await fetchVisionList();
  if (!data || data.length === 0) return DEFAULT_VISION;
  return data[0] || DEFAULT_VISION;
}

/**
 * Fetches Vision slider images.
 */
export async function fetchVisionImages() {
  const data = await safeFetch('/vision-images/', { next: { revalidate: 0 } });
  // Vision images are secondary, but we should return an empty array at minimum
  return (data && data.length > 0 ? data : []).map(img => ({
    ...img,
    image: getMediaUrl(img.image)
  }));
}

/**
 * Fetches the Timeline entries.
 */
export async function fetchTimeline() {
  const data = await safeFetch('/timeline/', { next: { revalidate: 0 } });
  const rawTimeline = (data && data.length > 0) ? data : DEFAULT_TIMELINE;

  return rawTimeline.map(item => ({
    ...item,
    thumbnail: getMediaUrl(item.thumbnail)
  }));
}

/**
 * Fetches and formats team members (Admin - no formatting).
 */
export async function fetchTeamMembers() {
  const data = await safeFetch('/team-members/', { next: { revalidate: 0 } });
  // We use DEFAULT_MEMBERS if team members are missing too
  const rawTeam = (data && data.length > 0) ? data : DEFAULT_MEMBERS.slice(0, 4);

  return rawTeam.map(m => ({
    ...m,
    image: getMediaUrl(m.image)
  }));
}

/**
 * Fetches all jobs (Admin - no filtering).
 */
export async function fetchAllJobs() {
  const data = await safeFetch('/job-openings/', { next: { revalidate: 0 } });
  return data || [];
}

/**
 * Fetches and formats testimonials.
 */
export async function fetchTestimonials() {
  const data = await safeFetch('/testimonials/', { next: { revalidate: 0 } });
  const rawTestimonials = (data && data.length > 0) ? data : DEFAULT_TESTIMONIALS;

  return rawTestimonials.map(t => ({
    ...t,
    image: getMediaUrl(t.image)
  }));
}

/**
 * Fetches and formats Gallery images.
 */
export async function fetchGallery() {
  const data = await safeFetch('/gallery/', { next: { revalidate: 0 } });
  const rawGallery = (data && data.length > 0) ? data : DEFAULT_GALLERY;

  return rawGallery.map(img => ({
    ...img,
    image: getMediaUrl(img.image)
  }));
}

/**
 * Generic delete helper for admin managers.
 * Always targets the remote backend directly to avoid the localhost fallback delay.
 */
export async function deleteResource(path, id) {
  const url = `${REMOTE_BASE_URL}/${path}/${id}/`;
  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (response.ok) {
      return { success: true };
    }
    console.warn(`Delete failed: ${response.status} ${response.statusText}`);
    return null;
  } catch (err) {
    console.error('Delete network error:', err);
    return null;
  }
}

/**
 * Helper to generate slug from name
 */
export function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
/**
 * Fetches all necessary website content in parallel for a single-load experience.
 */
export async function fetchAllWebsiteData() {
  try {
    const [jobs, members, vision, visionImages, timeline, team, testimonials, gallery] = await Promise.all([
      fetchJobs(),
      fetchMembers(),
      fetchVision(),
      fetchVisionImages(),
      fetchTimeline(),
      fetchTeamMembers(),
      fetchTestimonials(),
      fetchGallery()
    ]);

    const data = {
      jobs: jobs || [],
      members: members || [],
      vision: vision || null,
      visionImages: visionImages || [],
      timeline: timeline || [],
      team: team || [],
      testimonials: testimonials || [],
      gallery: gallery || []
    };

    // Aggregate all unique image URLs from the website data for preloading
    const imageUrls = new Set();

    data.members.forEach(m => m.image && imageUrls.add(m.image));
    data.timeline.forEach(t => t.thumbnail && imageUrls.add(t.thumbnail));
    data.testimonials.forEach(t => t.image && imageUrls.add(t.image));
    data.gallery.forEach(g => g.image && imageUrls.add(g.image));
    data.visionImages.forEach(v => v.image && imageUrls.add(v.image));

    return {
      ...data,
      imageUrls: Array.from(imageUrls)
    };
  } catch (error) {
    console.error("Critical: Error during global data fetch:", error);
    return {
      jobs: DEFAULT_JOBS,
      members: DEFAULT_MEMBERS,
      vision: DEFAULT_VISION,
      visionImages: DEFAULT_VISION_IMAGES,
      timeline: DEFAULT_TIMELINE,
      team: DEFAULT_MEMBERS.slice(0, 4), // Fallback for team
      testimonials: DEFAULT_TESTIMONIALS,
      gallery: DEFAULT_GALLERY,
      imageUrls: []
    };
  }
}
