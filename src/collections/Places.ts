import type { CollectionConfig } from "payload";

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Places: CollectionConfig = {
  slug: "places",
  labels: {
    singular: "Espaço / Local",
    plural: "Espaços (A Visitar)",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "categoryTop", "categorySub", "isPublished"],
  },
  access: {
    read: ({ req }) => {
      // Allow public read access to published places
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
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Informação Principal",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Nome do Local",
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
                  label: "Categoria Principal",
                  required: true,
                  options: [
                    { label: "Cultura", value: "Cultura" },
                    { label: "Natureza", value: "Natureza" },
                  ],
                },
                {
                  name: "categorySub",
                  type: "select",
                  label: "Subcategoria",
                  required: true,
                  options: [
                    // Cultura
                    { label: "Museus", value: "Museus" },
                    { label: "Igrejas", value: "Igrejas" },
                    { label: "Mercados", value: "Mercados" },
                    { label: "Monumentos", value: "Monumentos" },
                    { label: "Teatros", value: "Teatros" },
                    { label: "Posto de Turismo", value: "Posto de Turismo" },
                    // Natureza
                    { label: "Espaços urbanos", value: "Espaços urbanos" },
                    { label: "Vida selvagem", value: "Vida selvagem" },
                    { label: "Observatórios", value: "Observatórios" }, // Normalized to match frontend filter
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Detalhes e Contactos",
          fields: [
            {
              name: "address",
              type: "text",
              label: "Morada",
              required: true, // Made required as per your TS Interface, physical places usually need this
            },
            {
              type: "row",
              fields: [
                {
                  name: "phone",
                  type: "text",
                  label: "Telefone (Opcional)",
                },
                {
                  name: "websiteUrl",
                  type: "text",
                  label: "URL do Website (Opcional)",
                  admin: {
                    description: "Ex: https://www.exemplo.pt",
                  },
                },
              ],
            },
            {
              name: "schedule",
              type: "text",
              label: "Horário (Opcional)",
              admin: {
                description: "Ex: Terça a sábado 07h00-14h00",
              },
            },
          ],
        },
      ],
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
  ],
};
