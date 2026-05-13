# EventHub — Frontend ↔ Backend API integration (handoff for backend team)

This document describes how the **EventHub React (Vite) frontend** is prepared to integrate with **EventHub.API** (ASP.NET). The UI is still largely **mock-driven**; HTTP is not fully wired yet. Use this as a contract checklist and alignment guide.

**Related internal doc:** `SPECIFIC_BACKEND_READINESS.md` (frontend-focused audit).

---

## 1. Base URL and environment

- The SPA expects all API routes under a single base ending with **`/api`**.
- Frontend constant: `API_BASE_URL` = `VITE_API_BASE_URL` **or** default `http://localhost:5178/api` (see `src/config/api.js`).
- **CORS:** Please allow the Vite dev origin (e.g. `http://localhost:5173`) and production web origin. Expose any headers the client needs; allow `Authorization`, `Content-Type`, and common methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).

---

## 2. Authentication (JWT)

**Assumption for integration:** The client will send:

```http
Authorization: Bearer <access_token>
```

on protected routes once login is implemented.

| Endpoint | Notes |
|----------|--------|
| `POST /api/auth/register` | Body includes `applyAs`. Frontend signup uses label **Organizer**; the client maps it to **`EventOrganizer`** before sending (see `mapApplyAsForRegister` in `src/services/authService.js`). Allowed values: **`Admin`**, **`EventOrganizer`**, **`Participant`**. |
| `POST /api/auth/login` | Body: `{ email, password }`. Frontend expects **`AuthResult`**: `{ token, expiresAtUtc, user }` (confirm exact property names/casing match your DTO). |
| `POST /api/auth/logout` | Client will call when session ends (optional body per your design). |
| `POST /api/auth/reset-password` | As implemented on your side. |

**Please confirm:**

- Token format (JWT), expiry handling, and whether refresh tokens exist.
- Whether `user` in `AuthResult` matches what `GET /api/user/me` returns (helps the client cache profile).

---

## 3. Endpoints the frontend is aligned with (by area)

Below matches the controller layout we documented from **EventHub.API**. If any route or verb differs in your branch, flag it early.

### Auth — `AuthController`

- `POST /api/auth/register` — `{ email, password, firstName, lastName, applyAs, phoneNumber }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, expiresAtUtc, user }`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password`

### Events — `EventController`

- `GET /api/event`
- `GET /api/event/approved`
- `GET /api/event/pending` — used for **admin “pending events”** queue in our service mapping
- `GET /api/event/upcoming?count=10`
- `GET /api/event/search?keyword=&venue=&categoryId=&eventDate=`
- `GET /api/event/{id}`
- `GET /api/event/organizer/{organizerId}`
- `GET /api/event/category/{categoryId}`
- `POST /api/event` / `PUT /api/event/{id}` / `DELETE /api/event/{id}`
- `GET /api/event/{eventId}/analytics`
- `GET /api/event/{eventId}/organizer-analytics`

**Backend event DTO (representative)** vs **UI list/card shape:** The API may return nested `category`, `organizer`, `attachments`, `eventDate` as ISO string, `price`, etc. The participant UI uses a flatter card model (`date`, `time`, `ticketPrice`, `imageUrl`, …). The frontend implements **`normalizeEvent(apiEvent)`** in `src/services/eventService.js` to map your response → UI. **Please share** the canonical JSON property names for `eventDate`, `image` (URL vs relative path), and `category` (object vs id).

### Categories — `CategoryController`

- `GET /api/category`, `GET /api/category/with-counts`, `GET /api/category/{id}`, `GET /api/category/name/{name}`, CRUD for admin flows as you defined.

**Dependency:** Organizer **create/update** body needs **`categoryId`**. The current form still captures **category name** for UX; we will load categories from **`GET /api/category`** (or `with-counts`) and bind **ids** when wiring the API.

### Favorites (watchlist) — `FavoriteController`

- `POST /api/favorite/event/{eventId}` — **User from JWT** (no user id in body assumed).
- `DELETE /api/favorite/{favoriteId}` — **Deletes by favorite row id**, not by `eventId`.
- `GET /api/favorite/user/{userId}`

**Questions for backend:**

- Is `GET /api/favorite/user/{userId}` restricted to **Admin** only? If participants cannot call it, we need a participant-safe list such as **`GET /api/favorite/me`** (JWT) returning favorites with **`id` (favoriteId)** and **`eventId`** for UI and delete.

### Reviews — `ReviewController`

- `POST /api/review` — Body: **`{ eventId, rating, comment }`**. **User identity from JWT** — frontend will **not** send `participantId`.
- `GET /api/review/event/{eventId}`
- `DELETE /api/review/{id}`

### Tickets — `TicketController`

- **`POST /api/ticket/purchase/{eventId}`** — **Participant from JWT**; frontend will **not** rely on a request body with `participantId` for purchase.
- `GET /api/ticket/participant/{participantId}`
- `GET /api/ticket/{id}`
- `GET /api/ticket/qrcode/{qrCode}`
- `GET /api/ticket/event/{eventId}`
- `GET /api/ticket/participant/{participantId}/has-purchased/{eventId}`

**Note:** We are **not** using `/api/ticket/book` or `/api/tickets/book`.

### Admin — `AdminController` (Admin JWT)

- `GET /api/admin/dashboard-stats`
- `GET /api/admin/organizers/pending`
- `GET /api/admin/organizers`
- `POST /api/admin/organizers/{id}/approve`
- `POST /api/admin/organizers/{id}/reject`
- `POST /api/admin/events/{id}/approve`
- `POST /api/admin/events/{id}/reject`
- `DELETE /api/admin/reviews/{id}`

### Attachments — `AttachmentController`

- `POST /api/attachment/upload?eventId={eventId}`
- `GET /api/attachment/event/{eventId}`
- `DELETE /api/attachment/{id}`

### Notifications — `NotificationController`

- `GET /api/notification/user/{userId}`
- `POST /api/notification/send`
- `PUT /api/notification/{id}/read`

### Users — `UserController`

- `GET /api/user/{id}`
- `GET /api/user/email/{email}`
- `GET /api/user/email-exists/{email}`
- `GET /api/user/me`
- `PUT /api/user/{id}`
- `DELETE /api/user/{id}`

### Orders — `OrderController`

- No dedicated frontend service file yet. **Please publish** route list and DTOs when checkout/order flows are ready so we can add `orderService.js`.

---

## 4. Organizer event create/update JSON (frontend draft)

`src/organizer/services/organizerService.js` exposes **`buildEventCreatePayload`** / **`buildEventUpdatePayload`** targeting a shape aligned with your **EventCreateDto / EventUpdateDto**:

```json
{
  "organizerId": "<from JWT or profile>",
  "categoryId": "<from category API>",
  "title": "string",
  "description": "string",
  "venue": "string",
  "eventDate": "ISO-or-local-datetime-string",
  "image": "string",
  "price": 0,
  "totalTickets": 0,
  "availableTickets": 0
}
```

**Open points:**

- Whether **`organizerId`** must be in the body or is implied from JWT for `POST /api/event`.
- **`image`:** today the form may only have a filename until **`POST /api/attachment/upload`** returns a URL or id — confirm desired flow (multipart vs JSON + separate upload).

---

## 5. Error contract (request)

To keep the SPA consistent, it helps if error responses use a predictable shape, for example:

```json
{
  "message": "Human-readable message",
  "errors": { "field": ["validation message"] }
}
```

(or your ProblemDetails standard). **HTTP status codes:** Prefer `400` validation, `401`/`403` auth, `404` missing resource, `409` conflicts — we will map these in the service layer when HTTP is enabled.

---

## 6. What we need from you before integration week

1. **Swagger / OpenAPI** URL or exported JSON for **EventHub.API** (or a short route table if Swagger is disabled).
2. **Sample JSON** for: `AuthResult`, `Event` (full GET by id), `Category`, `Favorite`, `Review`, `Ticket` (after purchase).
3. Answers on: **favorite list for current user**, **event image URL** strategy, **category list for dropdowns**, and whether **pending events** for admin are strictly **`GET /api/event/pending`** or a separate admin route.
4. **CORS** policy and **dev port** you run the API on (we default `5178` in `api.js` only as a placeholder).

---

## 7. Code pointers (for pairing sessions)

| Topic | Path |
|--------|------|
| API base | `src/config/api.js` |
| Auth + register role mapping | `src/services/authService.js` |
| Events + `normalizeEvent` | `src/services/eventService.js` |
| Favorites / watchlist | `src/services/watchlistService.js` |
| Reviews | `src/services/ratingService.js` |
| Ticket purchase | `src/services/bookingService.js` |
| Admin stubs | `src/admin/services/adminService.js` |
| Organizer DTO builders | `src/organizer/services/organizerService.js` |
| Shared normalizers | `src/utils/apiNormalizers.js` |

---

**Document owner:** Frontend (EventHub UI repo).  
**Audience:** EventHub.API backend engineers.  
**Status:** Pre-integration; mocks remain until `fetch` is implemented against your running API.
