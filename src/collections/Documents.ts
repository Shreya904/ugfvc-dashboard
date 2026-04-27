import type { CollectionConfig } from "payload";

export const Documents: CollectionConfig = {
  slug: "documents",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "docName", "date", "isPublished"],
  },
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true;
      }

      return {
        isPublished: {
          equals: true,
        },
      };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      required: true,
    },
    {
      name: "docName",
      type: "text",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "sourceUrl",
      type: "text",
      required: true,
    },
    {
      name: "file",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      index: true,
    },
    {
      name: "sortOrder",
      type: "number",
    },
    {
      name: "summary",
      type: "textarea",
    },
  ],
};
