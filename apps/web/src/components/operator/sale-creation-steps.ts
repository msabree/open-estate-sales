export function saleCreationSteps(saleId: string) {
  const base = `/operator/sales/${saleId}`;
  return [
    { id: 1, name: "Info", description: "Location", href: `${base}/location` },
    { id: 2, name: "Details", description: "About the sale", href: `${base}/details` },
    { id: 3, name: "Dates", description: "Schedule", href: `${base}/dates` },
    { id: 4, name: "Pictures", description: "Gallery", href: `${base}/pictures` },
    { id: 5, name: "Publish", description: "Go live", href: `${base}/publish` },
  ] as const;
}

