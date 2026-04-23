# LINQ Corporate Website - Technical Architecture & Systems Deep-Dive

This document provides an exhaustive overview of the LINQ Corporate Website architecture, including granular folder structures and detailed explanations of the core technical systems that drive the platform.

---

## 1. Company Profile

**Official Name:** LINQ Corporate Solutions Pvt. Ltd.  
**Tagline:** *Connecting global industries through ideas that drive opportunity.*

### Global Impact Statistics
- **Completed Projects:** 500+
- **Satisfied Customers:** 15k+
- **Worldwide Honors:** 45+

### Headquarters & Contact
- **Address:** Nilamber Corporate Park, Building C, 2nd Floor, Nilamber Circle, Vadodara, Gujarat 390007.
- **Mobile:** +91 9377333411
- **Email:** 
  - Daytime Operations: `hr.ds@linq-corporate.com`
  - Overnight Operations: `hr.ns@linq-corporate.com`
- **Social Presence:** [LinkedIn Profile](https://www.linkedin.com/company/linq-corporate-solutions-pvt-ltd)

### Operational Timing (24x7 Coverage)
- **Primary Shifts:**
  - Day: 09:30 - 18:00 IST
  - Night: 18:30 - 03:30 IST

---

## 2. Core Technical Architecture

The architecture is built on the principle of **High Availability through Resilience**. It is a decoupled system with a Next.js frontend and a Django REST API.

### Technical Stack
- **Frontend Framework:** Next.js 14+ (App Router)
- **State Management:** React Context API (`GlobalDataContext`)
- **Backend Framework:** Django (Python) + Django REST Framework
- **Database:** SQLite (for portability)
- **Deployment Strategy:** Static Site Generation (SSG) with client-side runtime fetching.

---

## 3. High-Availability "Resilience Engine"

The most critical architectural feature is the **Multi-Stage Fallback Logic** implemented in `src/lib/api.js`.

1. **Stage 1 (Remote Fetch):** On page load, the site attempts to fetch fresh content from the live production backend (PythonAnywhere).
2. **Stage 2 (Local Fallback):** If the production server is unreachable or slow, the system catches the error and automatically injects high-quality "Default Data" from `src/lib/default-data.js`.
3. **Stage 3 (Media Resilience):** Image paths are sanitized via `getMediaUrl()`, which strips stale domains and ensures all assets point to the active production media server.

---

## 4. Role-Based Access Control (RBAC)

The Admin Panel (`/admin`) implements a secure, permission-based interface.

- **Super Admin:** Can manage users, adjust any content, and has full "Edit" rights across all modules.
- **Admin User:** Permissions are granularly assigned via the `UserManager`. Each module (Gallery, Jobs, etc.) has independent `view` and `edit` flags.
- **UI Guarding:** The sidebar (`AdminSidebar.js`) and individual modules (`VisionManager.js`, etc.) dynamically hide or disable controls (buttons, inputs) based on the active user's permission token stored in `localStorage`.

---

## 5. Granular Directory Structure

### `/app` (Routes & Pages)
- `layout.js`: Root layout, manages SEO metadata and fonts.
- `page.js`: The "LinqHome" landing page.
- `providers.js`: Injects the `GlobalDataProvider` into the entire app.
- `/admin/`: Entry point for the administrative portal.
- `/about-us/`, `/careers/`, `/contact/`: Specific corporate landing pages.
- `sitemap.js` & `robots.js`: Automated SEO and indexing configurations.

### `/src/admin` (Content Management Hub)
- `AdminDashboard.js`: Live statistics and quick action hub.
- `UserManager.js`: Detailed interface for managing admin accounts and permissions.
- `VisionManager.js`: Dual-purpose editor for Vision text and slider image categorization.
- `CareerGrowthManager.js`: Complex editor for team members with nested experience timelines.
- `JobManager.js`: Job posting manager with priority/status assignment.
- `TestimonialManager.js` & `TimelineManager.js`: Draggable lists for site testimonials and "Our Story" events.

### `/src/components` (UI Elements)
- `navbar.js`: Intelligent navigation with scroll-to-section logic.
- `about-us.js`: The primary "About" component with dynamic vision/timeline integration.
- `career-growth.js`: Visual representation of member achievements.
- `contact-form.js`: Integrated form handling for lead generation.
- `footer.js`: Branding, social links, and legal disclosures.

### `/src/lib` (System Utilities)
- `api.js`: The heart of the data fetching system; manages HTTPS communication and fallbacks.
- `default-data.js`: The safety net; contains full-featured static data for every module.

### `/Backend` (API Architecture)
- `/content_api`: Core logic.
  - `models.py`: Database schema for all website entities.
  - `views.py`: Logic for reordering, filtering, and CRUD operations.
- `manage.py`: Django administrative utility.

---

## 6. Data Flow Lifecycle

1. **Bootstrap:** The `GlobalDataProvider` (in `app/providers.js`) initializes.
2. **Fetch:** `fetchAllWebsiteData()` (in `api.js`) triggers parallel asynchronous requests to the PythonAnywhere backend.
3. **Aggregate:** Data is stored in the `GlobalDataContext`.
4. **Distribute:** Components like `CareersSection` or `Timeline` consume the context via the `useGlobalData()` hook.
5. **Update:** Admin actions via `Managers` trigger direct `fetch` calls to the API, followed by a global state refresh to keep the UI synchronized.