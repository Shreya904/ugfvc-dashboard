import type { CollectionBeforeChangeHook } from "payload";

type FeaturedCollection = "events" | "documents" | "places" | "useful-contacts";

export const limitFeatured =
  (collection: FeaturedCollection): CollectionBeforeChangeHook =>
  async ({ data, req, originalDoc }) => {
    if (data?.isFeatured !== true) {
      return data;
    }

    const featured = await req.payload.find({
      collection,
      where: {
        isFeatured: { equals: true },
        ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
      },
      limit: 2,
      sort: "updatedAt",
      depth: 0,
    });

    const recordsToUnfeature = featured.docs.slice(0, featured.docs.length - 1);

    for (const record of recordsToUnfeature) {
      await req.payload.update({
        collection,
        id: record.id,
        data: { isFeatured: false },
        req,
        overrideAccess: true,
      });
    }

    return data;
  };
