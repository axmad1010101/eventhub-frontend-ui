# Dashboard backend readiness (Admin & Organizer)

This document describes the **current** EventHub frontend dashboards and how they will connect to the **ASP.NET EventHub.API** later. It is meant for handoff to backend engineers and QA.

---

## 1. Current status

- **Admin** and **Organizer** panels are **frontend-only**: data comes from **mock modules** and **service layers** that simulate short network delays.
- **No real HTTP** calls are made from these dashboards yet; **mock data is not removed** by this readiness pass.
- **Routing** is shared with the participant app in `src/App.jsx` (`ParticipantLayout`, `AdminLayout`, `OrganizerLayout`).

---

## 2. Admin features (UI today)

| Area | What the UI does |
|------|-------------------|
| **Dashboard stats** | `AdminDashboard` loads aggregated numbers via `getAdminStats()`. |
| **Event approval UI** | `ManageEvents` lists events with statuses; **Approve** / **Reject** call `approveEvent` / `rejectEvent` and update **local React state** (simulated workflow). |
| **Organizer approval UI** | `ManageOrganizers` lists organizers; approve/reject updates **local state** via `approveOrganizer` / `rejectOrganizer`. |
| **User management UI** | `ManageUsers` lists users with **search** and **role/status filters** (client-side only). |

---

## 3. Organizer features (UI today)

| Area | What the UI does |
|------|-------------------|
| **Dashboard stats** | `OrganizerDashboard` loads stats + **recent activity** from `organizerService`. |
| **Event management table** | `OrganizerEvents` lists events, filters, **delete** with confirm, link to create/edit. |
| **Create / edit event form** | `EventForm` reused by `CreateEvent` and `EditEvent`; submits through `createOrganizerEvent` / `updateOrganizerEvent` (in-memory store in dev). |
| **Analytics page** | `OrganizerAnalytics` shows summary cards, **top event by revenue**, **ticket availability** progress bars, and a **performance table**. |

---

## 4. Service files (swap bodies for `fetch` later)

| File | Role |
|------|------|
| `src/admin/services/adminService.js` | Admin dashboard, pending events list, organizer list, users, approve/reject stubs. |
| `src/organizer/services/organizerService.js` | Organizer stats, events CRUD (in-memory), analytics bundle. |

Pages should **keep importing only from these files** so wiring the API is localized.

---

## 5. Backend endpoints to map (confirmed direction)

### Admin (`AdminController` + related)

| Future HTTP | Purpose |
|-------------|---------|
| `GET /api/admin/dashboard-stats` | Dashboard numbers. |
| `GET /api/admin/organizers/pending` | Optional: pending-only organizer queue (UI may use full list + filter today). |
| `GET /api/admin/organizers` | Organizer directory / approvals. |
| `POST /api/admin/organizers/{id}/approve` | Approve organizer. |
| `POST /api/admin/organizers/{id}/reject` | Reject organizer. |
| `POST /api/admin/events/{id}/approve` | Approve event. |
| `POST /api/admin/events/{id}/reject` | Reject event. |

*Note:* Pending events for admin may also align with `GET /api/event/pending` depending on how the API splits responsibilities.

### Organizer (`EventController` + `AttachmentController`)

| Future HTTP | Purpose |
|-------------|---------|
| `GET /api/event/organizer/{organizerId}` | List events for the signed-in organizer. |
| `POST /api/event` | Create event (JSON body per DTO below). |
| `PUT /api/event/{id}` | Update event. |
| `DELETE /api/event/{id}` | Delete event. |
| `GET /api/event/{eventId}/organizer-analytics` | Analytics payload for one organizer scope (or composed server-side). |
| `POST /api/attachment/upload?eventId={eventId}` | File/image upload after create or on edit. |

**Target create/update body (backend DTO):**

```json
{
  "organizerId": "<from JWT or profile>",
  "categoryId": "<from category API>",
  "title": "string",
  "description": "string",
  "venue": "string",
  "eventDate": "ISO-or-local-datetime",
  "image": "string",
  "price": 0,
  "totalTickets": 0,
  "availableTickets": 0
}
```

---

## 6. Known backend readiness notes

1. **Category** — The form collects **category name** for display; the API expects **`categoryId`**. Load categories from **`GET /api/category`** (or `with-counts`) before go-live.
2. **`organizerId`** — Should come from **auth / JWT** (or `/api/user/me`); do not hardcode in production payloads.
3. **Uploads** — Image and attachment fields are UI placeholders until **`POST /api/attachment/upload?eventId={eventId}`** (or multipart strategy) is implemented.
4. **Admin JWT** — Approve/reject and admin stats/list routes require an **Admin**-role token.
5. **Organizer JWT** — Organizer-scoped routes require an **EventOrganizer** (or equivalent) token; list endpoints should not trust client-sent `organizerId` alone.

---

## 7. Testing checklist (routes)

After any routing or service change, smoke-test:

**Admin**

- [ ] `/admin`
- [ ] `/admin/events`
- [ ] `/admin/organizers`
- [ ] `/admin/users`

**Organizer**

- [ ] `/organizer`
- [ ] `/organizer/events`
- [ ] `/organizer/create-event`
- [ ] `/organizer/events/1/edit` (use a real `id` from your event list, e.g. `org-evt-1`)
- [ ] `/organizer/analytics`

**Participant**

- [ ] `/`
- [ ] `/events/1` (or another valid id)
- [ ] `/watchlist`

Optional: `/login`, `/signup` for auth shell consistency.

---

## Related docs

- `BACKEND_TEAM_API_INTEGRATION.md` — broader API handoff.
- `SPECIFIC_BACKEND_READINESS.md` — participant services & normalizers (if present in repo).

**Last updated:** dashboard readiness pass (documentation + copy cleanup on visible strings only).
