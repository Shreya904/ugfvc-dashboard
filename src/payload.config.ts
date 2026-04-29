import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { ContactSubmissions } from "./collections/ContactSubmissions";
import { Documents } from "./collections/Documents";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { Users } from "./collections/Users";
import { Events } from "./collections/Events"; // ✅ ADD THIS

const parseOrigins = (value?: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const localDevOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL;
const configuredOrigins = parseOrigins(process.env.PAYLOAD_ALLOWED_ORIGINS);

const allowedOrigins = Array.from(
  new Set([
    ...(serverURL ? [serverURL] : []),
    ...localDevOrigins,
    ...configuredOrigins,
  ]),
);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "replace-this-secret-in-env",
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor({}),
  admin: {
    user: Users.slug,
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),

  // ✅ UPDATED COLLECTIONS
  collections: [
    Users,
    Media,
    News,
    Events, // 👈 ADD HERE
    Documents,
    ContactSubmissions,
  ],
});
