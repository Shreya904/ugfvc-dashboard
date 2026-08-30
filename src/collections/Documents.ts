import type { CollectionConfig } from "payload";

import { limitFeatured } from "../hooks/limitFeatured";

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
    defaultColumns: ["title", "format", "type", "date", "isPublished"],
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
    beforeChange: [limitFeatured("documents")],
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
      type: "tabs",
      tabs: [
        {
          label: "Informações Principais",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Título",
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              label: "Descrição / Resumo",
              admin: {
                description: "Breve descrição exibida no card do documento.",
              },
            },
            {
              name: "docName",
              type: "text",
              label: "Nome do documento (Interno)",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              label: "Slug",
              unique: true,
              index: true,
              required: true,
              admin: {
                position: "sidebar",
              },
            },
          ],
        },
        {
          label: "Classificação & Filtros",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "format",
                  type: "select",
                  label: "Formato",
                  required: true,
                  options: [
                    { label: "Documento", value: "Documento" },
                    { label: "Áudio", value: "Audio" },
                    { label: "Vídeo", value: "Video" },
                  ],
                },
                {
                  name: "type",
                  type: "select",
                  label: "Tipo",
                  required: true,
                  options: [
                    { label: "Avisos", value: "Avisos" },
                    { label: "Editais", value: "Editais" },
                    { label: "Regulamentos", value: "Regulamentos" },
                    { label: "Administração", value: "Administração" },
                    { label: "Podcast", value: "Podcast" },
                    { label: "Entrevista", value: "Entrevista" },
                  ],
                },
                {
                  name: "topic",
                  type: "select",
                  label: "Tópico",
                  required: true,
                  options: [
                    { label: "Administrativo", value: "Administrativo" },
                    { label: "Memória", value: "Memória" },
                    { label: "Comunidade", value: "Comunidade" },
                  ],
                },
              ],
            },
            {
              name: "tags",
              type: "array",
              label: "Tags",
              minRows: 0,
              maxRows: 5,
              labels: {
                singular: "Tag",
                plural: "Tags",
              },
              fields: [
                {
                  name: "tag",
                  type: "text",
                  required: true,
                  admin: {
                    description: "Ex: #regras, #2023",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Mídia & Arquivos",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "fileTypeLabel",
                  type: "text",
                  label: "Rótulo do Tipo de Arquivo",
                  required: true,
                  admin: {
                    description: "Ex: 'Formato PDF', 'Audio', 'Formato Video'",
                  },
                },
                {
                  name: "readTime",
                  type: "text",
                  label: "Tempo de Leitura/Duração",
                  required: true,
                  admin: {
                    description: "Ex: '6min', '42min'",
                  },
                },
              ],
            },
            {
              name: "file",
              type: "relationship",
              label: "Arquivo Principal (Upload)",
              relationTo: "media",
            },
            {
              name: "sourceUrl",
              type: "text",
              label: "URL de Origem Externa (Opcional)",
              validate: (value: unknown) => {
                if (!value) return true; // Made optional so standard file uploads work alone
                if (typeof value !== "string" || !isLikelyUrl(value)) {
                  return "Introduza um URL http(s) válido";
                }
                return true;
              },
            },
            {
              name: "thumbnail",
              type: "relationship",
              label: "Capa do Vídeo (Thumbnail)",
              relationTo: "media",
              admin: {
                description: "Necessário apenas se o formato for 'Vídeo'.",
                condition: (data) => data.format === "Video",
              },
            },
          ],
        },
      ],
    },
    {
      name: "date",
      type: "date",
      label: "Data",
      index: true,
      required: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "isPublished",
      type: "checkbox",
      label: "Publicado",
      defaultValue: true,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Em destaque",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Ordem",
      admin: {
        position: "sidebar",
      },
    },
  ],
};
