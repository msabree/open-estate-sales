export function saleCreationSteps(saleId: string) {
  const base = `/dashboard/sales/${saleId}`;
  return [
    { id: 1, name: "Basics", description: "Location & type", href: `${base}/location` },
    { id: 2, name: "Copy", description: "Terms & story", href: `${base}/details` },
    { id: 3, name: "Dates", description: "Schedule", href: `${base}/dates` },
    { id: 4, name: "Pictures", description: "Gallery", href: `${base}/pictures` },
    { id: 5, name: "Publish", description: "Go live", href: `${base}/publish` },
  ] as const;
}

