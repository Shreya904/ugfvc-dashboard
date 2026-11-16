# CMS User Manual

This manual explains how to manage content in the Uniao de Freguesias Payload CMS and how the website/API consumes that content.

## 1. Accessing the CMS

### Admin panel

Start the application and open:

```text
http://localhost:3000/admin
```

The first user created is used as the initial administrator account. User accounts are managed in **Utilizadores**.

### Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

The CMS requires a MongoDB connection. Configure `MONGODB_URI`, `PAYLOAD_SECRET`, and the public server URL in `.env`.

## 2. Editorial workflow

1. Upload required images, documents, or audio in **Media**.
2. Create or edit the content item in its collection.
3. Select related media from the relationship fields.
4. Set the publication and featured flags where available.
5. Save the item.
6. Confirm the public API response before checking the website.

For content with `isPublished`, public visitors only receive records where `isPublished` is `true`. Authenticated CMS users can read unpublished records.

## 3. Collections

Collections are repeatable records and are available in the admin panel and through `/api/<slug>`.

### 3.1 Utilizadores (`users`)

Used for CMS authentication.

| Field | Required | Notes |
|---|---:|---|
| `email` | Yes | Supplied by Payload authentication. |
| `password` | Yes when creating | Used to sign in. |
| `name` | No | Display name. |
| `role` | Yes | `admin` or `editor`; defaults to `editor`. |

Use the authentication endpoints in Section 5 rather than storing credentials in frontend code.

### 3.2 Media (`media`)

Stores images and downloadable files used by other collections.

Allowed MIME types:

- `image/*`
- `application/pdf`
- `audio/*`
- `application/vnd.oasis.opendocument.text` (`.odt`)

Important fields:

- `alt`: accessible alternative text.
- `caption`: optional displayed caption.
- `filename` and `url`: assigned by the storage hook.

Media is publicly readable. Creating, updating, and deleting media requires an authenticated CMS user, or an allowed frontend origin for creation. Upload media before creating content that references it.

### 3.3 News (`news`)

Use for news articles.

| Field | Required | Notes |
|---|---:|---|
| `title` | Yes | Article title. |
| `slug` | Yes | Unique URL identifier; generated from `title` when omitted. |
| `excerpt` | Yes | Short card/summary text. |
| `description` | No | Rich-text article body. API responses also include extracted `plainText`. |
| `date` | Yes | Article date. |
| `category` | Yes | Category; repeated whitespace is normalized. |
| `mainImage` | No | Relationship to `media`. |
| `galleryImages` | No | Multiple relationships to `media`. |
| `isPublished` | No | Defaults to `true`. Controls public visibility. |
| `publishedAt` | No | Publication date. |
| `seoTitle`, `seoDescription` | No | Search-engine metadata. |

### 3.4 Events (`events`)

Use for activities and scheduled events.

Required fields include `title`, `slug`, `categoryTop`, `priceType`, `excerpt`, `date`, `time`, and `location`.

Other fields:

- `displayDate`: optional human-readable date range or recurring schedule.
- `registrationLink`: optional internal or external registration URL.
- `description`: rich-text full description.
- `isPast`: marks an event as past.
- `mainImage`, `galleryImages`: relationships to media.
- `isPublished`: defaults to `true`.
- `isFeatured`: defaults to `false`.
- `seoTitle`, `seoDescription`: optional SEO metadata.

The event slug is generated from the title when omitted. Only the configured number of featured records is retained by the featured-record hook.

### 3.5 Documents (`documents`)

Use for public documents, audio, and video entries. The actual file may be uploaded to Media or referenced by an external URL.

Required fields:

- `title`
- `docName`
- `slug`
- `format`: `Documento`, `Audio`, or `Video`
- `type`: `Avisos`, `Editais`, `Regulamentos`, `Administração`, `Podcast`, or `Entrevista`
- `topic`: `Administrativo`, `Memória`, or `Comunidade`
- `fileTypeLabel`
- `readTime`
- `date`

Optional fields:

- `description`
- `tags` (maximum five)
- `file`: relationship to Media
- `sourceUrl`: must be a valid `http://` or `https://` URL
- `thumbnail`: Media relationship, normally used for videos
- `isPublished`: defaults to `true`
- `isFeatured`: defaults to `false`
- `sortOrder`

If both `file` and `sourceUrl` are supplied, keep the frontend behavior in mind and use the one intended as the primary link.

### 3.6 Contact submissions (`contact-submissions`)

Stores messages submitted by the public contact form. Public users may create submissions, but reading, updating, and deleting them is restricted to authenticated users.

Required fields:

- `name`
- `email`
- `category`
- `message` (maximum 1,000 characters)
- `status`
- `submittedAt`

Categories are `Servicos e Atestados`, `Obras e Infraestruturas`, `Apoio Social`, `Atividades e Eventos`, and `Outras Questoes`.

Optional fields include `attachment`, `attachmentUrl`, `sourcePage`, `locale`, `consent`, and `internalNotes`.

Statuses:

- `new` (default)
- `in_review`
- `resolved`
- `archived`

### 3.7 Places (`places`)

Use for places and attractions.

Required fields:

- `title`
- `slug`
- `categoryTop`: `Cultura` or `Natureza`
- `categorySub`: the matching place subcategory
- `address`

Optional fields:

- `image`
- `phone`
- `websiteUrl`
- `locationUrl`
- `schedule`
- `isPublished` (defaults to `true`)
- `isFeatured` (defaults to `false`)

The slug is generated from the title when omitted.

### 3.8 Useful contacts (`useful-contacts`)

Use for public service contacts such as health, safety, education, associations, and social support.

Required fields:

- `title`
- `slug`
- `categoryTop`: `Saúde`, `Segurança`, `Ensino`, `Associações`, or `Social`
- `categorySub`

Optional fields:

- `phone`
- `email`
- `address`
- `schedule`
- `websiteUrl`
- `isPublished` (defaults to `true`)
- `isFeatured` (defaults to `false`)

### 3.9 Hero sliders (`hero-slider`)

Controls homepage slider sets.

Fields:

- `name`: internal name.
- `isActive`: whether this slider is used on the site.
- `slides`: at least one slide.

Each slide requires `type`, `image`, `title`, `linkText`, and `href`.

- `hero`: use `subtitle`.
- `event`: use `date` and `location`.
- `isExternal`: enable for links that should open in a new tab.

Only one slider can be active at a time. Activating one automatically deactivates the other active slider.

### 3.10 Executive members (`executivo`)

Publicly readable list of executive members.

Required fields are `name`, `role`, `responsibilities`, and `order`. `image` is optional and references Media. Lower `order` values appear first.

### 3.11 Site banners (`site-banners`)

Controls feature, helpdesk, and sticky banners.

`identifier` is unique and determines the banner placement. Available identifiers include:

- `home-helpdesk`
- `institucional-feature`
- `freguesia-feature`
- `ajuda-feature`
- `freguesia-espacos-helpdesk`
- `contactos-uteis-helpdesk`
- `noticias-slug-pharmacy`
- `eventos-slug-pharmacy`

Required content fields are `bodyPrefix`, `ctaLabel`, `ctaHref`, `image`, and `imageAlt`.

For helpdesk identifiers, use `headlineLine1` and `headlineLine2`. For feature/sticky banners, use `headline`. `tone` is available for sticky banners and can be `news` or `event`.

The `variant` value is assigned automatically from the identifier; do not try to maintain it manually.

### 3.12 Assembly table members (`mesa-assembleia`)

Publicly readable assembly board members.

Required fields: `name`, `role`, and `order`. `responsibilities` and `image` are optional. Use `order` to control display order.

### 3.13 Proposals (`propostas`)

Publicly readable citizen proposals.

Required fields:

- `titulo`
- `autor`
- `categoria`: `Obras na cidade`, `Formação`, `Ambiente e Espaços Verdes`, `Ação Social`, `Cultura e Desporto`, or `Outro`
- `data`
- `descricao`

`status` defaults to `aprovado` and can be `pendente`, `aprovado`, or `rejeitado`.

## 4. Globals

Globals are singleton pages rather than repeatable collection records. They are edited once and read through `/api/globals/<slug>`.

### Executive meetings (`reunioes-executivo`)

- `introText`: required rich-text introduction.
- `documents`: meeting document array.

Each document has a required `title`, `date`, `format`, `type`, `topic`, `fileTypeLabel`, and `readTime`. It may also contain `description`, up to five `tags`, a Media `file`, `sourceUrl`, and a video `thumbnail`.

### Assembly meetings (`reunioes-assembleia`)

Has the same structure as Executive meetings, but represents Assembly meetings. The `type` options are `Ata`, `Avisos`, `Editais`, `Regulamentos`, and `Podcast`.

## 5. REST API

The API base URL is:

```text
https://<server>/api
```

The catch-all route supports `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, and `OPTIONS`.

### Collection endpoints

For any collection slug:

```text
GET    /api/<slug>          List records
POST   /api/<slug>          Create a record
GET    /api/<slug>/<id>     Read one record
PATCH  /api/<slug>/<id>     Partially update a record
PUT    /api/<slug>/<id>     Replace/update a record
DELETE /api/<slug>/<id>     Delete a record
```

Examples:

```text
GET /api/news?where[isPublished][equals]=true&sort=-date&limit=10
GET /api/events?where[isPublished][equals]=true&where[isPast][equals]=false
GET /api/media/<id>?depth=0
GET /api/propostas?sort=-data
```

Common query parameters:

- `page`, `limit`: pagination.
- `sort`: field name; prefix with `-` for descending order.
- `where[...]`: Payload filter expressions.
- `depth`: relationship expansion depth.
- `locale`, `fallback-locale`: localization controls when configured.
- `draft`: draft mode where supported.

### Global endpoints

```text
GET  /api/globals/reunioes-executivo
POST /api/globals/reunioes-executivo
GET  /api/globals/reunioes-assembleia
POST /api/globals/reunioes-assembleia
```

Use the global `POST` endpoint to save the singleton data. Confirm the exact request shape against the Payload version used by the deployment before integrating a custom client.

### Authentication endpoints

The `users` collection exposes:

```text
POST /api/users/login
POST /api/users/logout
GET  /api/users/me
POST /api/users/refresh-token
POST /api/users/forgot-password
POST /api/users/reset-password
```

Send JSON with `Content-Type: application/json`. Example login:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

### Uploading Media

Use `multipart/form-data` for `POST /api/media`. The file field is `file`; `alt` and `caption` may be sent as additional fields.

```bash
curl -X POST http://localhost:3000/api/media ^
  -H "Cookie: payload-token=<token>" ^
  -F "file=@poster.pdf" ^
  -F "alt=Event poster" ^
  -F "caption=Autumn programme"
```

The storage hook writes the file to the configured local storage implementation. Set `MEDIA_BASE_URL` when the public media URL must use a separate base URL.

### Creating a contact submission

```bash
curl -X POST http://localhost:3000/api/contact-submissions ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"category\":\"Atividades e Eventos\",\"message\":\"I would like more information.\",\"consent\":true,\"sourcePage\":\"/contacto\",\"locale\":\"pt\"}"
```

The API assigns `status: "new"` and `submittedAt` when those values are omitted.

## 6. Access and publishing notes

- News, Events, Documents, Places, and Useful contacts expose published records publicly and all records to authenticated users.
- Media, Hero sliders, Executive members, Site banners, Assembly members, Proposals, and both meeting globals have public read access configured.
- Contact submissions are publicly creatable but not publicly readable.
- Editorial changes should be made through the authenticated admin panel.
- CORS and CSRF origins include the configured `PAYLOAD_PUBLIC_SERVER_URL`, local development origins, and comma-separated `PAYLOAD_ALLOWED_ORIGINS`.

Never use the fallback `PAYLOAD_SECRET` value in a production deployment. Set a long, random `PAYLOAD_SECRET` and use a production MongoDB connection string.

## 7. Troubleshooting

### A record is not visible on the website

Check that:

1. `isPublished` is enabled where the collection has that field.
2. The record is not filtered out by the API query.
3. Related Media records exist and are publicly reachable.
4. The frontend is calling the correct collection slug.
5. CORS/CSRF origins include the frontend origin.

### A slug is rejected

Slugs are unique. Edit the slug to a unique value or change the title and save again. Slugs generated from titles are lower-case, accent-free, and hyphen-separated.

### A featured record does not remain featured

Featured records are limited by the `limitFeatured` hook. Review other featured records in the same collection and keep only the intended entries selected.

### A document URL is rejected

`documents.sourceUrl` accepts only absolute `http://` or `https://` URLs. For a local file, upload it to Media and select it in the `file` relationship instead.

## 8. Source files

The content model is defined in:

- `src/payload.config.ts`
- `src/collections/`
- `src/hooks/limitFeatured.ts`
- `app/(payload)/api/[...slug]/route.ts`

The existing endpoint summary is available in `API_REFERENCE.md`. This manual is intended for day-to-day CMS operators and frontend/API integrators.
