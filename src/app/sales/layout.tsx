import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Estate Sales",
    default: "Estate sales",
  },
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
