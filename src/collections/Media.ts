import type { CollectionConfig } from "payload";
import { uploadToAzureSAS } from "../storage/azureSas";

export const Media: CollectionConfig = {
  slug: "media",

  labels: {
    singular: "Media",
    plural: "Media",
  },

  access: {
    read: () => true,

    create: ({ req }) => {
      // Admin users always allowed
      if (req.user) return true;

      const origin = req.headers.get("origin");

      const allowedOrigins = process.env.FRONTEND_ORIGINS?.split(",") || [];

      return allowedOrigins.includes(origin || "");
    },

    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    disableLocalStorage: true,
  },

  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        const file = (req as any).file;

        if (!file) return data;

        const uploaded = await uploadToAzureSAS(
          file.data,
          file.name,
          file.mimetype,
        );

        return {
          ...data,
          url: uploaded.url,
          filename: uploaded.filename,
        };
      },
    ],
  },

  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
    },
    {
      name: "caption",
      type: "textarea",
      label: "Legenda",
    },
  ],
};
