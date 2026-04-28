# API and Function Reference

Last reanalysis: 2026-04-27
Project: uniaodefreguesias-cms
Stack: Next.js App Router + Payload CMS v3.79.0

## 1) API gateway and base paths

All REST API requests are handled by a catch-all Payload route:

- Route file: app/(payload)/api/[...slug]/route.ts
- Public base path: /api/\*
- Enabled HTTP methods: GET, POST, DELETE, PATCH, PUT, OPTIONS

Because this project uses Payload REST handlers, collection endpoints are available under `/api/<collection-slug>`.

Admin UI routes are separate:

- /admin
- /admin/\*

Site route currently:

- /

## 2) Collection slugs available in this project

From Payload config, active collections are:

- users
- media
- news
- documents
- contact-submissions

## 3) REST endpoints you can use

Use these endpoint patterns for each collection slug listed above.

### 3.1 Collection list/create

- GET /api/<slug>
  - List documents with filtering/pagination query params.
- POST /api/<slug>
  - Create a document.

Common useful query params on list endpoints:

- `page`, `limit`, `sort`, `where`, `depth`, `locale`, `fallback-locale`, `draft`

### 3.2 Single document read/update/delete

- GET /api/<slug>/<id>
  - Get one document by id.
- PATCH /api/<slug>/<id>
  - Partial update.
- PUT /api/<slug>/<id>
  - Full update semantics.
- DELETE /api/<slug>/<id>
  - Delete one document.

### 3.3 Auth endpoints (users collection)

Because `users` has `auth: true`, these auth endpoints are exposed under `/api/users/*`:

- POST /api/users/login
- POST /api/users/logout
- GET /api/users/me
- POST /api/users/refresh-token
- POST /api/users/forgot-password
- POST /api/users/reset-password

Note: some flows (for example forgot/reset email delivery) depend on environment and email setup.

## 4) Collection-specific behavior and access control

This section is critical for correct endpoint usage: requests may be allowed/denied or mutated by these functions.

### 4.1 users

- Slug: `users`
- Auth enabled: yes
- Key fields: `name`, `role` (default `editor`)

Behavior notes:

- `role` defaults to `editor` when omitted.
- Admin user collection is configured to `users`.

### 4.2 media

- Slug: `media`
- Upload enabled: yes
- Allowed mime types: `image/*`, `application/pdf`

Access rules:

- Read: public
- Create/Update/Delete: authenticated user required

Usage note:

- Upload with `POST /api/media` using multipart/form-data.

### 4.3 news

- Slug: `news`

Access rules:

- Read:
  - Authenticated users can read all.
  - Public users only read documents where `isPublished = true`.
- Create/Update/Delete: authenticated user required.

Hook functions:

- beforeValidate:
  - If `slug` is missing and `title` exists, sets `slug = toSlug(title)`.
- beforeChange:
  - Normalizes `category` by trimming and collapsing repeated spaces.

Utility functions used by hooks:

- `toSlug(value)`:
  - lowercases, removes diacritics, replaces non-alphanumeric runs with `-`, trims leading/trailing `-`.
- `normalizeCategory(value)`:
  - trims text and reduces internal whitespace to a single space.

### 4.4 documents

- Slug: `documents`

Access rules:

- Read:
  - Authenticated users can read all.
  - Public users only read documents where `isPublished = true`.
- Create/Update/Delete: authenticated user required.

Hook functions:

- beforeValidate:
  - If `slug` is missing and `title` exists, sets `slug = toSlug(title)`.

Validation functions:

- `sourceUrl.validate(value)`:
  - Accepts only valid `http://` or `https://` URLs.

Utility functions:

- `toSlug(value)`:
  - same normalization behavior as in `news`.
- `isLikelyUrl(value)`:
  - parses URL and accepts only `http:`/`https:` protocols.

### 4.5 contact-submissions

- Slug: `contact-submissions`

Access rules:

- Create: public
- Read/Update/Delete: authenticated user required

Defaulting behavior:

- `status` defaults to `new`.
- `submittedAt` defaults to `new Date().toISOString()`.

Implication:

- Public contact form can submit via POST.
- Public users cannot list or read submissions.

## 5) Global config functions affecting API behavior

From `src/payload.config.ts`:

- `parseOrigins(value)`:
  - Splits comma-separated origin list, trims entries, removes empties.
- CORS/CSRF allowed origins are built from:
  - `PAYLOAD_PUBLIC_SERVER_URL`
  - local dev defaults (`localhost:3000/3001`, `127.0.0.1:3000/3001`)
  - `PAYLOAD_ALLOWED_ORIGINS`

Impact:

- Cross-origin API calls must come from configured origins.

## 6) Endpoint quick examples

### 6.1 Public: list published news

Request:

- GET /api/news?where[isPublished][equals]=true&sort=-date&limit=10

### 6.2 Public: create contact submission

Request:

- POST /api/contact-submissions
- Content-Type: application/json

Body example:

{
"name": "Jane Doe",
"email": "jane@example.com",
"category": "Atividades e Eventos",
"message": "I would like more information.",
"consent": true,
"sourcePage": "/contacto",
"locale": "pt"
}

### 6.3 Auth: login user

Request:

- POST /api/users/login
- Content-Type: application/json

Body example:

{
"email": "admin@example.com",
"password": "your-password"
}

### 6.4 Auth: upload media

Request:

- POST /api/media
- Content-Type: multipart/form-data
- Field for file content: `file`

Optional metadata fields:

- `alt`
- `caption`

## 7) Source of truth files (reanalyzed)

- app/(payload)/api/[...slug]/route.ts
- src/payload.config.ts
- src/collections/Users.ts
- src/collections/Media.ts
- src/collections/News.ts
- src/collections/Documents.ts
- src/collections/ContactSubmissions.ts

This document reflects the current code in those files as of the reanalysis date above.
