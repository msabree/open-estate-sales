import ExploreSales from "@/components/ExploreSales";
import {
  DEFAULT_MAP_CENTER,
  DEMO_EXPLORE_SALES,
} from "@/data/demo-explore-sales";

export default function SalesIndexPage() {
  return (
    <ExploreSales sales={DEMO_EXPLORE_SALES} initialCenter={DEFAULT_MAP_CENTER} />
  );
}
