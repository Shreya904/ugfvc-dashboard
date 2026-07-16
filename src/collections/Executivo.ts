import type { CollectionConfig } from "payload";

export const Executivo: CollectionConfig = {
  slug: "executivo",
  labels: {
    singular: "Membro do Executivo",
    plural: "Membros do Executivo",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
  },
  access: {
    read: () => true, // Assumes public read access is required for the frontend
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Cargo / Título",
      required: true,
      admin: {
        description: "Ex: Presidente, Secretário, 1º Vogal",
      },
    },
    {
      name: "responsibilities",
      type: "textarea",
      label: "Responsabilidades / Descrição",
      required: true,
      admin: {
        description: "Breve descrição das funções assumidas pelo membro.",
      },
    },
    {
      name: "image",
      type: "relationship",
      relationTo: "media", // Assumes your media collection is named 'media'
      label: "Fotografia",
      // Left optional as requested
      admin: {
        description: "Imagem do membro (Opcional).",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem de Exibição",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Define quem aparece primeiro. Ex: 1 para Presidente, 2 para Secretário.",
      },
    },
  ],
};
