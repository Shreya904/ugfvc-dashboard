import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Utilizador",
    plural: "Utilizadores",
  },
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
    },
    {
      name: "role",
      type: "select",
      label: "Perfil",
      required: true,
      defaultValue: "editor",
      options: [
        {
          label: "Administrador",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
    },
  ],
};
