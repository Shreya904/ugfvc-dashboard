import type { CollectionConfig } from "payload";

export const MesaAssembleia: CollectionConfig = {
  slug: "mesa-assembleia",
  labels: {
    singular: "Membro da Mesa da Assembleia",
    plural: "Mesa da Assembleia",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
  },
  access: {
    read: () => true, // Public read access for the frontend
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
        description:
          "Ex: Presidente da Assembleia, Primeiro Secretário, Segundo Secretário",
      },
    },
    {
      name: "responsibilities",
      type: "textarea",
      label: "Responsabilidades / Descrição",
      required: false, // Made optional in case you don't always need it
      admin: {
        description: "Breve descrição das funções assumidas pelo membro.",
      },
    },
    {
      name: "image",
      type: "relationship",
      relationTo: "media",
      label: "Fotografia",
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
          "Define quem aparece primeiro. Ex: 1 para Presidente, 2 para 1º Secretário, 3 para 2º Secretário.",
      },
    },
  ],
};
