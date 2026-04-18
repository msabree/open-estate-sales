/** Sale listing categories — stored in `sales.sale_kind`; extend as needed. */
export const SALE_KIND_OPTIONS = [
  { value: "estate_sale", label: "Estate sale" },
  { value: "moving_sale", label: "Moving sale" },
  { value: "warehouse_estate_sale", label: "Estate sale at warehouse" },
  { value: "business_closing", label: "Business closing" },
] as const;

export type SaleKindValue = (typeof SALE_KIND_OPTIONS)[number]["value"];

export function isSaleKind(value: string): value is SaleKindValue {
  return SALE_KIND_OPTIONS.some((o) => o.value === value);
}
