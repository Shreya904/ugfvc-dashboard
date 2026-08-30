import type { GlobalConfig } from "payload";

export const ReunioesAssembleia: GlobalConfig = {
  slug: "reunioes-assembleia",
  label: "Página: Reuniões de Assembleia",
  access: {
    read: () => true, // Allows the frontend to read the data publicly
  },
  fields: [
    {
      name: "introText",
      type: "richText",
      label: "Texto Introdutório (Aparece no topo da página)",
      required: true,
    },
    {
      name: "documents",
      type: "array",
      label: "Documentos (Atas, Editais, etc.)",
      labels: {
        singular: "Documento",
        plural: "Documentos",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Título",
              required: true,
            },
            {
              name: "date",
              type: "date",
              label: "Data da Reunião",
              required: true,
              admin: {
                date: { pickerAppearance: "dayOnly" },
              },
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "Descrição / Resumo",
        },
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
                { label: "Ata", value: "Ata" },
                { label: "Avisos", value: "Avisos" },
                { label: "Editais", value: "Editais" },
                { label: "Regulamentos", value: "Regulamentos" },
                { label: "Podcast", value: "Podcast" },
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
          fields: [{ name: "tag", type: "text", required: true }],
        },
        {
          type: "row",
          fields: [
            {
              name: "fileTypeLabel",
              type: "text",
              label: "Rótulo do Tipo de Arquivo (Ex: Formato PDF)",
              required: true,
            },
            {
              name: "readTime",
              type: "text",
              label: "Tempo de Leitura/Duração (Ex: 6min)",
              required: true,
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
        },
        {
          name: "thumbnail",
          type: "relationship",
          label: "Capa do Vídeo (Thumbnail)",
          relationTo: "media",
          admin: {
            condition: (_, siblingData) => siblingData.format === "Video",
          },
        },
      ],
    },
  ],
};
