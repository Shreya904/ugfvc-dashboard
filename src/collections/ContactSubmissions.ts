import type { CollectionConfig } from "payload";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: {
    singular: "Submissao de contacto",
    plural: "Submissoes de contacto",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "category", "status", "submittedAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    },
    {
      name: "category",
      type: "select",
      label: "Categoria",
      required: true,
      options: [
        "Servicos e Atestados",
        "Obras e Infraestruturas",
        "Apoio Social",
        "Atividades e Eventos",
        "Outras Questoes",
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "Mensagem",
      required: true,
      maxLength: 1000,
    },
    {
      name: "attachment",
      type: "relationship",
      label: "Anexo",
      relationTo: "media",
    },
    {
      name: "attachmentUrl",
      type: "text",
      label: "URL do anexo",
    },
    {
      name: "sourcePage",
      type: "text",
      label: "Pagina de origem",
    },
    {
      name: "locale",
      type: "text",
      label: "Idioma",
    },
    {
      name: "consent",
      type: "checkbox",
      label: "Consentimento",
    },
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "new",
      options: [
        {
          label: "Novo",
          value: "new",
        },
        {
          label: "Em analise",
          value: "in_review",
        },
        {
          label: "Resolvido",
          value: "resolved",
        },
        {
          label: "Arquivado",
          value: "archived",
        },
      ],
    },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Notas internas",
    },
    {
      name: "submittedAt",
      type: "date",
      label: "Submetido em",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
};
