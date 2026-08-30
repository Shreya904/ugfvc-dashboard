import type { CollectionConfig } from "payload";

import { limitFeatured } from "../hooks/limitFeatured";

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Evento",
    plural: "Eventos",
  },

  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "date",
      "categoryTop",
      "priceType",
      "isPublished",
    ],
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
    beforeChange: [limitFeatured("events")],
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
      admin: {
        position: "sidebar",
      },
    },

    {
      type: "row",
      fields: [
        {
          name: "categoryTop",
          type: "select",
          label: "Tipo de Evento",
          required: true,
          options: [
            { label: "Exposições", value: "Exposições" },
            {
              label: "Atividades ao ar livre",
              value: "Atividades ao ar livre",
            },
            { label: "Feiras e Mercados", value: "Mercados" }, // Mantém o value "Mercados" para não quebrar a DB
            { label: "Música e Espetáculos", value: "Música e Espetáculos" },
            { label: "Desporto", value: "Desporto" },
            { label: "Cultura e Património", value: "Cultura e Património" },
            { label: "Educação e Ciência", value: "Educação e Ciência" },
            { label: "Solidariedade", value: "Solidariedade" },
            { label: "Religião e Tradições", value: "Religião e Tradições" },
          ],
        },
        {
          name: "priceType",
          type: "select",
          label: "Preço",
          required: true,
          options: [
            { label: "Gratuito", value: "Gratuito" },
            { label: "A pagar", value: "A pagar" },
          ],
        },
      ],
    },

    // 🔹 CONTENT
    {
      name: "excerpt",
      type: "textarea",
      label: "Resumo (Aparece no card)",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      label: "Descrição completa (Aparece na página do evento)",
    },

    // 🔹 EVENT META
    {
      name: "date",
      type: "date",
      label: "Data exata (Usado para ordenação e filtros de tempo)",
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "displayDate",
      type: "text",
      label: "Data de Exibição (Opcional)",
      admin: {
        description:
          "Ex: '24 março a 25 de abril' ou 'Segundas-feiras'. Se deixado em branco, a 'Data exata' será mostrada.",
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
      name: "registrationLink",
      type: "text",
      label: "Link de Inscrição (Opcional)",
      admin: {
        description:
          "Deixe em branco para usar o padrão '/inscricoes'. Pode ser um link externo.",
      },
    },

    // 🔹 OPTIONAL FLAG
    {
      name: "isPast",
      type: "checkbox",
      label: "Evento passado",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
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

    // 🔹 PUBLISHING & SEO
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
      name: "seoTitle",
      type: "text",
      label: "Título SEO",
      admin: { position: "sidebar" },
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "Descrição SEO",
      admin: { position: "sidebar" },
    },
  ],
};
