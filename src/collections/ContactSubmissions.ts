import type { CollectionConfig } from "payload";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
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
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "category",
      type: "select",
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
      required: true,
      maxLength: 1000,
    },
    {
      name: "attachment",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "attachmentUrl",
      type: "text",
    },
    {
      name: "sourcePage",
      type: "text",
    },
    {
      name: "locale",
      type: "text",
    },
    {
      name: "consent",
      type: "checkbox",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: ["new", "in_review", "resolved", "archived"],
    },
    {
      name: "internalNotes",
      type: "textarea",
    },
    {
      name: "submittedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
};
