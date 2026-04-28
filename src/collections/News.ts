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

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Noticia",
    plural: "Noticias",
  },
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
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data;
        }

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
        if (!data || typeof data.category !== "string") {
          return data;
        }

        return {
          ...data,
          category: normalizeCategory(data.category),
        };
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo",
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
    {
      name: "excerpt",
      type: "textarea",
      label: "Resumo",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      label: "Descricao",
    },
    {
      name: "date",
      type: "date",
      label: "Data",
      index: true,
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
      label: "Categoria",
      required: true,
    },
    {
      name: "mainImage",
      type: "relationship",
      label: "Imagem principal",
      relationTo: "media",
    },
    {
      name: "galleryImages",
      type: "relationship",
      label: "Galeria de imagens",
      relationTo: "media",
      hasMany: true,
    },
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
    {
      name: "seoTitle",
      type: "text",
      label: "Titulo SEO",
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "Descricao SEO",
    },
  ],
};
