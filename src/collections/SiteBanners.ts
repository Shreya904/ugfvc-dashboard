import type { CollectionConfig } from "payload";

export const SiteBanners: CollectionConfig = {
  slug: "site-banners",
  labels: {
    singular: "Banner do Site",
    plural: "Banners do Site",
  },
  admin: {
    useAsTitle: "identifier",
    defaultColumns: ["identifier", "ctaLabel"],
  },
  access: {
    read: () => true,
  },
  // We use a hook to automatically assign the 'variant' behind the scenes
  // so the frontend still receives it, but the editor never has to touch it!
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.identifier.includes("helpdesk")) data.variant = "helpdesk";
        else if (
          data.identifier.includes("sticky") ||
          data.identifier.includes("pharmacy")
        )
          data.variant = "sticky";
        else data.variant = "feature";
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Configuração de Posicionamento",
          fields: [
            {
              name: "identifier",
              type: "select",
              label: "Local do Banner (Identificador)",
              required: true,
              unique: true,
              options: [
                {
                  label: "Página Inicial (Bottom Helpdesk)",
                  value: "home-helpdesk",
                },
                {
                  label: "Institucional (Feature)",
                  value: "institucional-feature",
                },
                { label: "Freguesia (Feature)", value: "freguesia-feature" },
                { label: "Ajuda (Feature)", value: "ajuda-feature" },
                {
                  label: "Espaços Públicos (Bottom Helpdesk)",
                  value: "freguesia-espacos-helpdesk",
                },
                {
                  label: "Contactos Úteis (Bottom Helpdesk)",
                  value: "contactos-uteis-helpdesk",
                },
                {
                  label: "Notícias (Right Sticky)",
                  value: "noticias-slug-pharmacy",
                },
                {
                  label: "Eventos (Right Sticky)",
                  value: "eventos-slug-pharmacy",
                },
              ],
            },
            // THE VARIANT FIELD IS GONE FROM HERE!
            {
              name: "tone",
              type: "select",
              label: "Tom (Apenas para Sticky)",
              options: [
                { label: "Notícia (News)", value: "news" },
                { label: "Evento (Event)", value: "event" },
              ],
              admin: {
                // Show only if the identifier belongs to a sticky banner
                condition: (data) => data.identifier?.includes("pharmacy"),
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "pageId",
                  type: "text",
                  label: "Page ID (Opcional - Apenas informativo)",
                  admin: { description: "Ex: home, institucional, freguesia" },
                },
                {
                  name: "slotId",
                  type: "text",
                  label: "Slot ID (Opcional - Apenas informativo)",
                  admin: { description: "Ex: bottom-helpdesk, feature-banner" },
                },
              ],
            },
          ],
        },
        {
          label: "Conteúdo e Textos",
          fields: [
            // --- CAMPOS PARA HELPDESK ---
            {
              name: "headlineLine1",
              type: "text",
              label: "Título (Linha 1)",
              admin: {
                // Condition now relies directly on the identifier chosen!
                condition: (data) => data.identifier?.includes("helpdesk"),
                description: "Ex: 'Precisa de um serviço'",
              },
            },
            {
              name: "headlineLine2",
              type: "text",
              label: "Título (Linha 2)",
              admin: {
                condition: (data) => data.identifier?.includes("helpdesk"),
                description: "Ex: 'da Junta?'",
              },
            },
            // --- CAMPOS PARA FEATURE E STICKY ---
            {
              name: "headline",
              type: "text",
              label: "Título",
              admin: {
                condition: (data) => !data.identifier?.includes("helpdesk"),
                description: "Ex: 'Procura uma farmácia?'",
              },
            },
            // --- CAMPOS GERAIS ---
            {
              name: "bodyPrefix",
              type: "text",
              label: "Texto antes do Botão/Link",
              required: true,
              admin: { description: "Ex: 'Visite a' ou 'Visite o'" },
            },
            {
              type: "row",
              fields: [
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Texto do Botão/Link",
                  required: true,
                  admin: { description: "Ex: 'Lista pública'" },
                },
                {
                  name: "ctaHref",
                  type: "text",
                  label: "Link do Botão (URL)",
                  required: true,
                  admin: { description: "Ex: '/contactos-uteis'" },
                },
              ],
            },
          ],
        },
        {
          label: "Mídia",
          fields: [
            {
              name: "image",
              type: "relationship",
              relationTo: "media",
              label: "Imagem de Fundo",
              required: true,
            },
            {
              name: "imageAlt",
              type: "text",
              label: "Texto Alternativo da Imagem",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
