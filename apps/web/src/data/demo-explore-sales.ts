import type { ExploreSale } from "@/components/explore-sales/SaleCard";

export const DEFAULT_MAP_CENTER: [number, number] = [33.749, -84.388];

/** Demo listings for explore / home until real data is wired. */
export const DEMO_EXPLORE_SALES: ExploreSale[] = [
  {
    id: "demo-atl-1",
    title: "Smith Family Estate",
    lat: 33.749,
    lng: -84.388,
    addressVisible: false,
    main_display_image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    sale_dates: [{ sale_date: "2026-05-01" }, { sale_date: "2026-05-03" }],
    region_slug: "atlanta-ga",
    listing_slug: "smith-family-estate-2026",
    city: "Atlanta",
    state: "GA",
    href: "/sales/atlanta-ga/smith-family-estate-2026",
    workspace_id: "ws-demo-co",
    created_by: "user-host-1",
  },
  {
    id: "demo-atl-2",
    title: "Midtown Vintage & Art",
    lat: 33.783,
    lng: -84.383,
    addressVisible: true,
    main_display_image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDI%3D",
    sale_dates: [{ sale_date: "2026-05-10" }, { sale_date: "2026-05-11" }],
    region_slug: "atlanta-ga",
    listing_slug: "midtown-vintage-art-2026",
    city: "Atlanta",
    state: "GA",
    href: "/sales/atlanta-ga/midtown-vintage-art-2026",
  },
  {
    id: "demo-bkn-1",
    title: "Park Slope Moving Sale",
    lat: 40.672,
    lng: -73.978,
    addressVisible: false,
    main_display_image:
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80",
    sale_dates: [{ sale_date: "2026-06-06" }, { sale_date: "2026-06-07" }],
    region_slug: "brooklyn-ny",
    listing_slug: "park-slope-moving-sale-2026",
    city: "Brooklyn",
    state: "NY",
    href: "/sales/brooklyn-ny/park-slope-moving-sale-2026",
  },
];
