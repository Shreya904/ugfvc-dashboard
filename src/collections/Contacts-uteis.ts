import type { CollectionConfig } from "payload";

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const UsefulContacts: CollectionConfig = {
  slug: "useful-contacts",
  labels: {
    singular: "Contacto Útil",
    plural: "Contactos Úteis",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "categoryTop",
      "categorySub",
      "phone",
      "isPublished",
    ],
  },
  access: {
    read: ({ req }) => {
      // Allow public read access to published contacts
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
              label: "Nome / Título",
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
                    { label: "Saúde", value: "Saúde" },
                    { label: "Segurança", value: "Segurança" },
                    { label: "Ensino", value: "Ensino" },
                    { label: "Associações", value: "Associações" },
                  ],
                },
                {
                  name: "categorySub",
                  type: "select",
                  label: "Subcategoria",
                  required: true,
                  options: [
                    // Saúde
                    { label: "Centros de saúde", value: "Centros de saúde" },
                    { label: "Hospitais", value: "Hospitais" },
                    { label: "Clínicas", value: "Clínicas" },
                    { label: "Farmácias", value: "Farmácias" },
                    { label: "Dentistas", value: "Dentistas" },
                    // Segurança
                    { label: "Bombeiros", value: "Bombeiros" },
                    { label: "Polícia", value: "Polícia" },
                    { label: "Proteção Civil", value: "Proteção Civil" },
                    // Ensino
                    { label: "Escolas", value: "Escolas" },
                    {
                      label: "Jardins de infância",
                      value: "Jardins de infância",
                    },
                    { label: "Ensino superior", value: "Ensino superior" },
                    { label: "Formação", value: "Formação" },
                    // Associações
                    { label: "Cultura", value: "Cultura" },
                    { label: "Desporto", value: "Desporto" },
                    { label: "Comercial", value: "Comercial" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Detalhes de Contacto",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "phone",
                  type: "text",
                  label: "Telefone",
                  admin: {
                    description: "Ex: 112 ou 234 379 920",
                  },
                },
                {
                  name: "email",
                  type: "email",
                  label: "Email (Opcional)",
                  // Left optional as requested
                },
              ],
            },
            {
              name: "address",
              type: "text",
              label: "Morada (Opcional)",
              // Left optional as requested
            },
            {
              name: "schedule",
              type: "text",
              label: "Horário (Opcional)",
              admin: {
                description: "Ex: Seg a Sex, 09:00 - 18:00",
              },
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
