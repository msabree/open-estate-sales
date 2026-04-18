/** Demo inventory for marketplace mode until API-backed items exist. */
export type MarketplaceItem = {
  itemId: string;
  /** Internal sale row id (favorites / analytics) */
  saleId: string;
  regionSlug: string;
  listingSlug: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  saleTitle?: string;
};

export const DEMO_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    itemId: "item-midcentury-lamp",
    saleId: "demo-atl-2",
    regionSlug: "atlanta-ga",
    listingSlug: "midtown-vintage-art-2026",
    title: "Mid-century floor lamp",
    description: "Brass + frosted glass, works great",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    tags: ["lighting", "vintage"],
    saleTitle: "Midtown Vintage & Art",
  },
  {
    itemId: "item-dining-chairs",
    saleId: "demo-atl-1",
    regionSlug: "atlanta-ga",
    listingSlug: "smith-family-estate-2026",
    title: "Set of 4 oak dining chairs",
    description: "Solid wood, minor wear",
    imageUrl:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG95c3xlbnwwfHwwfHx8Mg%3D%3D",
    tags: ["furniture", "wood"],
    saleTitle: "Smith Family Estate",
  },
  {
    itemId: "item-vinyl-lot",
    saleId: "demo-bkn-1",
    regionSlug: "brooklyn-ny",
    listingSlug: "park-slope-moving-sale-2026",
    title: "Classic rock vinyl lot (20+)",
    description: "Mostly 70s–80s pressings",
    imageUrl:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG95c3xlbnwwfHwwfHx8Mg%3D%3D",
    tags: ["media", "collectibles"],
    saleTitle: "Park Slope Moving Sale",
  },
  {
    itemId: "item-kitchenaid",
    saleId: "demo-atl-1",
    regionSlug: "atlanta-ga",
    listingSlug: "smith-family-estate-2026",
    title: "KitchenAid stand mixer",
    description: "Artisan series, includes bowl",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    tags: ["kitchen", "appliances"],
    saleTitle: "Smith Family Estate",
  },
  {
    itemId: "item-area-rug",
    saleId: "demo-bkn-1",
    regionSlug: "brooklyn-ny",
    listingSlug: "park-slope-moving-sale-2026",
    title: "8×10 wool area rug",
    description: "Navy + cream pattern",
    imageUrl:
      "https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRveXN8ZW58MHx8MHx8fDI%3D",
    tags: ["decor", "textiles"],
    saleTitle: "Park Slope Moving Sale",
  },
  {
    itemId: "item-garden-tools",
    saleId: "demo-atl-2",
    regionSlug: "atlanta-ga",
    listingSlug: "midtown-vintage-art-2026",
    title: "Garden tool bundle",
    description: "Spade, rake, shears",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    tags: ["outdoor", "tools"],
    saleTitle: "Midtown Vintage & Art",
  },
];
