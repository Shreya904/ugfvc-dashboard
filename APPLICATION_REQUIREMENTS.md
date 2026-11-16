# União de Freguesias CMS

Runtime, deployment, and integration requirements for this standalone Payload
CMS service.

## Application purpose

The application provides the administration panel and REST API used by the
separate União de Freguesias public website. It manages editorial content,
public information pages, authenticated CMS users, media, and contact form
submissions. The CMS must be deployed and configured independently from the
public website.

## Runtime requirements

- Node.js and npm compatible with Next.js `16.2.0-canary.95`, React `19.2.0`,
  Payload `3.79.0`, and TypeScript `5.8`.
- A MongoDB instance reachable through `MONGODB_URI`.
- A writable, persistent directory for uploaded media.
- Network access from the public website to the CMS `/api/*` endpoints.
- A strong, unique `PAYLOAD_SECRET` in every non-development environment.

`package.json` does not declare a Node.js engine range. Pin the Node.js version
in the deployment platform before production use.

## Configuration

Copy `.env.example` to `.env`. Never commit the populated file or any secret.

| Variable | Required | Purpose |
|---|---:|---|
| `PAYLOAD_SECRET` | Yes | Secret used for authentication and token handling. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `PAYLOAD_PUBLIC_SERVER_URL` | Outside local development | Public base URL of the CMS. |
| `PAYLOAD_ALLOWED_ORIGINS` | For cross-origin use | Comma-separated trusted origins for Payload CORS and CSRF. |
| `FRONTEND_ORIGINS` | When the website creates media | Comma-separated origins allowed to create media without CMS login. |
| `MEDIA_DIR` | Optional | Writable upload directory; defaults to `/home/ubuntu/ugfvc-media`. |
| `MEDIA_BASE_URL` | Recommended | Public URL prefix used in returned media URLs. |

The website origin must be included in both the CMS origin configuration and
the website's configured CMS URL. Use a persistent volume for `MEDIA_DIR`;
local disk storage is not durable in an ephemeral container.

## Install, generate, develop, and verify

Run these commands from the repository root:

```bash
npm install
npm run generate:importmap
npm run generate:types
npm run dev
npm run build
npm start
```

The administration panel is normally available at
`http://localhost:3000/admin`; the API is available at `/api/*`.

## Functional requirements

- Provide authenticated CMS administration through the `users` collection.
- Expose REST endpoints for news, events, documents, places, useful contacts,
  banners, sliders, governance content, proposals, media, and submissions.
- Restrict anonymous reads of news, events, documents, places, and useful
  contacts to records with `isPublished = true`.
- Allow public creation of contact submissions while protecting their contents
  and lifecycle operations behind authentication.
- Allow public media reads and origin-restricted media creation from the public
  website; protect media updates and deletion.
- Provide public singleton meeting pages for executive and assembly meetings.
- Generate unique filenames and preserve uploaded files in persistent storage.
- Restrict CORS and CSRF to trusted origins.

## Data and operations

Configured collections are `users`, `media`, `news`, `events`, `documents`,
`contact-submissions`, `places`, `useful-contacts`, `hero-slider`, `executivo`,
`site-banners`, `mesa-assembleia`, and `propostas`.

Configured globals are `reunioes-executivo` and `reunioes-assembleia`.
See [API_REFERENCE.md](./API_REFERENCE.md) for routes, access rules, fields,
upload formats, and request examples.

MongoDB must be backed up independently of the application process. Uploaded
media must also be backed up independently when local disk storage is used.

## Deployment constraints

- Keep this project's npm installation separate from the public site's pnpm
  installation.
- Do not copy the CMS `.env` file into the public website folder.
- Do not use the development fallback secret in production.
- Mount persistent storage at `MEDIA_DIR` when deploying in a container.
- Configure `MEDIA_BASE_URL` to the URL that serves that directory.
- Keep the CMS URL and allowed origins synchronized with the public website's
  `NEXT_PUBLIC_PAYLOAD_URL` setting.
- Do not use wildcard CORS or CSRF origins in production.
