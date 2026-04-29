import type { CollectionConfig } from "payload";

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategory = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Evento",
    plural: "Eventos",
  },

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location", "isPublished"],
  },

  access: {
    read: ({ req }) => {
      if (req.user) return true;

      return {
        isPublished: {
          equals: true,
        },
      };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        if (!data.slug && typeof data.title === "string") {
          return {
            ...data,
            slug: toSlug(data.title),
          };
        }

        return data;
      },
    ],

    beforeChange: [
      ({ data }) => {
        if (!data) return data;

        return {
          ...data,
          category:
            typeof data.category === "string"
              ? normalizeCategory(data.category)
              : data.category,
        };
      },
    ],
  },

  fields: [
    // 🔹 BASIC INFO
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      unique: true,
      index: true,
      required: true,
    },

    // 🔹 CONTENT
    {
      name: "excerpt",
      type: "textarea",
      label: "Resumo",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      label: "Descrição completa",
    },

    // 🔹 EVENT META (THIS MATCHES YOUR UI)
    {
      name: "date",
      type: "date",
      label: "Data",
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "time",
      type: "text",
      label: "Hora (ex: 18:00 - 20:00)",
      required: true,
    },
    {
      name: "location",
      type: "text",
      label: "Localização",
      required: true,
    },
    {
      name: "category",
      type: "text", // ✅ free input as you wanted
      label: "Categoria",
      required: true,
    },

    // 🔹 OPTIONAL FLAG (helps your filter logic)
    {
      name: "isPast",
      type: "checkbox",
      label: "Evento passado",
      defaultValue: false,
    },

    // 🔹 MEDIA
    {
      name: "mainImage",
      type: "relationship",
      relationTo: "media",
      label: "Imagem principal",
    },
    {
      name: "galleryImages",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
      label: "Galeria de imagens",
    },

    // 🔹 PUBLISHING
    {
      name: "isPublished",
      type: "checkbox",
      label: "Publicado",
      defaultValue: true,
      index: true,
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publicado em",
    },

    // 🔹 SEO (same as news)
    {
      name: "seoTitle",
      type: "text",
      label: "Título SEO",
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "Descrição SEO",
    },
  ],
};
