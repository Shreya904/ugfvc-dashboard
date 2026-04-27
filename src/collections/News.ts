import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "category", "isPublished"],
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
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "description",
      type: "richText",
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
      name: "category",
      type: "text",
      required: true,
    },
    {
      name: "mainImage",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "galleryImages",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      index: true,
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "seoTitle",
      type: "text",
    },
    {
      name: "seoDescription",
      type: "textarea",
    },
  ],
};
