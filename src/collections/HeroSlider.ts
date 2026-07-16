import { CollectionConfig } from "payload/types";

export const HeroSlider: CollectionConfig = {
  slug: "hero-slider",
  labels: {
    singular: "Hero Slider",
    plural: "Hero Sliders",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "name",
    description:
      'Faça a gestão dos sliders da página inicial. Apenas um slider pode estar ativo de cada vez. O primeiro slide deve ser do tipo "Hero" para o estilo único.',
  },
  hooks: {
    // This hook ensures only ONE slider can be active at any given time.
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        // Se este slider está a ser definido como ativo
        if (data.isActive === true) {
          // Procurar todos os outros sliders que estão atualmente ativos
          const activeSliders = await req.payload.find({
            collection: "hero-slider",
            where: {
              isActive: { equals: true },
            },
            depth: 0,
          });

          // Iterar e desativar os outros sliders
          for (const slider of activeSliders.docs) {
            // Evitar tentar atualizar o próprio documento que está a ser salvo agora
            if (originalDoc && slider.id === originalDoc.id) continue;

            await req.payload.update({
              collection: "hero-slider",
              id: slider.id,
              data: {
                isActive: false,
              },
              req,
              overrideAccess: true,
            });
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome de Referência Interna",
      required: true,
      admin: {
        description:
          'Exemplo: "Slider de Verão 2024" ou "Slider Principal". Apenas para uso interno.',
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Slider Ativo",
      defaultValue: false,
      admin: {
        description:
          "Marque esta opção para exibir este slider no site. Se ativar este, qualquer outro slider ativo será automaticamente desativado.",
      },
    },
    {
      name: "slides",
      type: "array",
      label: "Diapositivos (Slides)",
      labels: {
        singular: "Slide",
        plural: "Slides",
      },
      minRows: 1,
      required: true,
      fields: [
        {
          name: "type",
          type: "select",
          label: "Tipo de Estrutura do Slide",
          required: true,
          defaultValue: "event",
          options: [
            {
              label: "Hero (Primeiro slide - Título Simples com Fundo Azul)",
              value: "hero",
            },
            { label: "Evento (Caixa de Texto Padrão)", value: "event" },
          ],
        },
        {
          name: "image",
          type: "upload",
          label: "Imagem de Fundo",
          relationTo: "media",
          required: true,
        },
        {
          name: "title",
          type: "text",
          label: "Título Principal",
          required: true,
        },
        {
          name: "subtitle",
          type: "text",
          label: "Subtítulo (Apenas para o Hero)",
          admin: {
            condition: (_, siblingData) => siblingData.type === "hero",
            description:
              "Texto que aparece abaixo do título principal com tamanho ligeiramente menor.",
          },
        },
        {
          name: "date",
          label: "Data ou Destaque Principal",
          type: "text",
          admin: {
            condition: (_, siblingData) => siblingData.type === "event",
            description:
              'Ex: "Atualidade Local" ou "12 de Outubro". Fica em destaque do lado direito da caixa.',
          },
        },
        {
          name: "location",
          label: "Localização ou Descrição Breve",
          type: "textarea",
          admin: {
            condition: (_, siblingData) => siblingData.type === "event",
            description: "Pequeno texto descritivo ou morada do evento.",
          },
        },
        {
          name: "linkText",
          label: "Texto do Botão / Link",
          type: "text",
          required: true,
          admin: {
            description: 'Ex: "Ver mais", "Aceder ao balcão".',
          },
        },
        {
          name: "href",
          label: "URL de Destino",
          type: "text",
          required: true,
          admin: {
            description:
              'Ex: "/eventos" para páginas internas ou "https://www.google.pt" para links externos.',
          },
        },
        {
          name: "isExternal",
          label: "Abrir link num novo separador?",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description:
              "Ative esta opção se o link apontar para fora do site.",
          },
        },
      ],
    },
  ],
};
