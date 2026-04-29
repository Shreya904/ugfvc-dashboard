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
    create: ({ req }) => Boolean(req.user),
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

        // No file → just continue normal flow
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
