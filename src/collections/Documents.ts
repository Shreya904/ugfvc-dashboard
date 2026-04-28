import type { CollectionConfig } from "payload";

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isLikelyUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const Documents: CollectionConfig = {
  slug: "documents",
  labels: {
    singular: "Documento",
    plural: "Documentos",
  },
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
      name: "docName",
      type: "text",
      label: "Nome do documento",
      required: true,
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
      name: "sourceUrl",
      type: "text",
      label: "URL de origem",
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== "string" || !isLikelyUrl(value)) {
          return "Introduza um URL http(s) valido";
        }

        return true;
      },
    },
    {
      name: "file",
      type: "relationship",
      label: "Ficheiro",
      relationTo: "media",
    },
    {
      name: "isPublished",
      type: "checkbox",
      label: "Publicado",
      defaultValue: true,
      index: true,
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Ordem",
    },
    {
      name: "summary",
      type: "textarea",
      label: "Resumo",
    },
  ],
};
