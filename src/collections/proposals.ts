import type { CollectionConfig } from "payload";

export const Proposals: CollectionConfig = {
  slug: "propostas",
  labels: {
    singular: "Proposta",
    plural: "Propostas",
  },
  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "autor", "categoria", "data", "status"],
  },
  access: {
    read: () => true, // Public read access so the site can fetch them
  },
  fields: [
    {
      name: "titulo",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "autor",
      label: "Autor",
      type: "text",
      required: true,
    },
    {
      name: "categoria",
      label: "Categoria",
      type: "select",
      required: true,
      options: [
        { label: "Obras na cidade", value: "Obras na cidade" },
        { label: "Formação", value: "Formação" },
        {
          label: "Ambiente e Espaços Verdes",
          value: "Ambiente e Espaços Verdes",
        },
        { label: "Ação Social", value: "Ação Social" },
        { label: "Cultura e Desporto", value: "Cultura e Desporto" },
        { label: "Outro", value: "Outro" },
      ],
    },
    {
      name: "data",
      label: "Data de Apresentação",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMMM, yyyy",
        },
      },
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
    {
      name: "descricao",
      label: "Descrição / Proposta",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      defaultValue: "aprovado",
      options: [
        { label: "Pendente", value: "pendente" },
        { label: "Aprovado", value: "aprovado" },
        { label: "Rejeitado", value: "rejeitado" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};

export default Proposals;
