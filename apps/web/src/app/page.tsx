import type { Metadata } from "next";

import ExploreSales from "@/components/ExploreSales";
import { HomeWaitlistStrip } from "@/components/HomeWaitlistStrip";
import {
  DEFAULT_MAP_CENTER,
  DEMO_EXPLORE_SALES,
} from "@/data/demo-explore-sales";

export const metadata: Metadata = {
  title: "Browse estate sales near you",
  description:
    "Search local estate sales on the map or list — free for shoppers and operators.",
};

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ExploreSales sales={DEMO_EXPLORE_SALES} initialCenter={DEFAULT_MAP_CENTER} />
      <HomeWaitlistStrip />
    </div>
  );
}
