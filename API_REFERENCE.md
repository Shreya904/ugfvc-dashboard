# API and Function Reference

Project: `uniaodefreguesias-cms`
Stack: Next.js App Router, Payload CMS 3.79.0, MongoDB

## Base routes

The catch-all route in `app/(payload)/api/[...slug]/route.ts` exposes Payload
REST handlers under `/api/*` for `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, and
`OPTIONS`.

- Administration: `/admin` and `/admin/*`
- Collections: `/api/<collection-slug>`
- Globals: `/api/globals/<global-slug>`

Standard collection operations are:

```text
GET    /api/<slug>          list documents
POST   /api/<slug>          create a document
GET    /api/<slug>/<id>     read one document
PATCH  /api/<slug>/<id>     partially update
PUT    /api/<slug>/<id>     replace/update
DELETE /api/<slug>/<id>     delete one document
```

List requests can use Payload query parameters such as `page`, `limit`, `sort`,
`where`, `depth`, `locale`, `fallback-locale`, and `draft`.

## Collections

| Slug | Purpose | Public read | Write access |
|---|---|---:|---|
| `users` | Authenticated CMS users | No | No explicit collection rule |
| `media` | Uploaded files and media metadata | Yes | Authenticated users, or anonymous requests from `FRONTEND_ORIGINS` for create |
| `news` | News articles | Published only | Authenticated users |
| `events` | Events | Published only | Authenticated users |
| `documents` | Documents and external resources | Published only | Authenticated users |
| `contact-submissions` | Public contact form submissions | No | Create is public; read/update/delete require authentication |
| `places` | Places to visit | Published only | Authenticated users |
| `useful-contacts` | Useful public contacts | Published only | Authenticated users |
| `hero-slider` | Homepage slider configurations | Yes | No explicit collection rule |
| `executivo` | Executive members | Yes | No explicit collection rule |
| `site-banners` | Website banner content | Yes | No explicit collection rule |
| `mesa-assembleia` | Assembly board members | Yes | No explicit collection rule |
| `propostas` | Public proposals | Yes | No explicit collection rule |

For collections marked “Published only”, anonymous reads are constrained to
`isPublished = true`; authenticated users can read all records.
“No explicit collection rule” means the collection does not define an
operation-specific access function in its config; confirm the effective Payload
default before exposing write operations to an untrusted client.

## Globals

Globals are singleton documents and use the following routes:

```text
GET /api/globals/reunioes-executivo
GET /api/globals/reunioes-assembleia
```

Both globals are publicly readable and contain introductory rich text plus
meeting documents, including dates, formats, topics, tags, media references,
and optional source URLs.

## Authentication

The `users` collection has Payload authentication enabled:

```text
POST /api/users/login
POST /api/users/logout
GET  /api/users/me
POST /api/users/refresh-token
POST /api/users/forgot-password
POST /api/users/reset-password
```

Forgot/reset email delivery requires the corresponding email configuration.
Use the authenticated session or token when calling protected endpoints.

## Media uploads

`media` accepts `image/*`, `application/pdf`, `audio/*`, and
`application/vnd.oasis.opendocument.text`.

```text
POST /api/media
Content-Type: multipart/form-data
file=<binary file>
alt=<optional text>
caption=<optional text>
```

Media reads are public. Authenticated users can update or delete media.
Anonymous creation is allowed only when the request `Origin` exactly matches
one of the comma-separated values in `FRONTEND_ORIGINS`.

Files are written to `MEDIA_DIR` with a unique generated filename. If
`MEDIA_BASE_URL` is configured, returned media URLs use that base URL.

## Collection behavior

- `news`, `events`, `documents`, `places`, and `useful-contacts` generate a
  normalized slug from `title` when one is not supplied.
- News categories are trimmed and repeated whitespace is collapsed.
- `documents`, `events`, `places`, and `useful-contacts` limit the number of
  featured records through the shared `limitFeatured` hook.
- Activating a `hero-slider` automatically deactivates other active sliders.
- `site-banners` derives its variant from the selected identifier.
- `contact-submissions.status` defaults to `new`.
- `contact-submissions.submittedAt` defaults to the current ISO timestamp.
- `documents.sourceUrl` accepts only `http://` and `https://` URLs.

## Example requests

List published news:

```text
GET /api/news?where[isPublished][equals]=true&sort=-date&limit=10
```

Create a contact submission:

```http
POST /api/contact-submissions
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "category": "Atividades e Eventos",
  "message": "I would like more information.",
  "consent": true,
  "sourcePage": "/contacto",
  "locale": "pt"
}
```

Login:

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

## Cross-origin requests

CORS and CSRF origins are built from `PAYLOAD_PUBLIC_SERVER_URL`, local
development origins (`localhost`/`127.0.0.1` on ports 3000 and 3001), and
`PAYLOAD_ALLOWED_ORIGINS`. Restrict these values to trusted origins in
production; do not use a wildcard.
