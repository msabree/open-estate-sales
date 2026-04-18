import { z } from "zod";

import { SALE_KIND_OPTIONS } from "@/lib/sale-kinds";
import { plainTextFromHtml } from "@/utils/html";

/** Calendar day index (UTC) for YYYY-MM-DD strings. */
export const dayIndex = (dateStr: string): number => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
};

export const saleDateRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
});

export type SaleDateRow = z.infer<typeof saleDateRowSchema>;

const saleKindEnum = z.enum(
  [
    SALE_KIND_OPTIONS[0]!.value,
    SALE_KIND_OPTIONS[1]!.value,
    SALE_KIND_OPTIONS[2]!.value,
    SALE_KIND_OPTIONS[3]!.value,
  ],
);

export const saleStepBasicsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Sale name is required")
      .max(120, "Keep the name under 120 characters"),
    saleKind: saleKindEnum,
    phoneDisplay: z.enum(["show_account", "hidden", "custom"]),
    contactPhoneCustom: z.string().nullable(),
    directionsParking: z.string().max(4000).nullable(),
    address: z.string().min(1, "Address is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    city: z.string().min(1),
    state: z.string().length(2, "Use a 2-letter state code"),
    zip: z.string().nullable(),
    addressRevealAt: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.phoneDisplay === "custom") {
      const p = data.contactPhoneCustom?.trim() ?? "";
      if (p.length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a phone number buyers can reach you at.",
          path: ["contactPhoneCustom"],
        });
      }
    }
  });

export const saleStepCopySchema = z
  .object({
    termsHtml: z.string().max(200_000).nullable(),
    descriptionHtml: z.string().max(500_000).nullable(),
  })
  .superRefine((data, ctx) => {
    const terms = plainTextFromHtml(data.termsHtml);
    if (terms.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Terms & conditions should be at least a short paragraph.",
        path: ["termsHtml"],
      });
    }
    const desc = plainTextFromHtml(data.descriptionHtml);
    if (desc.length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Write a fuller description for shoppers (at least a few sentences).",
        path: ["descriptionHtml"],
      });
    }
  });

/** Step 3: 1–4 consecutive calendar days, each with hours. */
export const saleStepScheduleSchema = z.object({
  saleDates: z
    .array(saleDateRowSchema)
    .min(1, "Add at least one sale day")
    .max(4, "You can add up to four consecutive sale days"),
  previewNotes: z.string().max(8000).nullable(),
});

export function validateConsecutiveSaleDates(
  rows: SaleDateRow[],
): { ok: true } | { ok: false; message: string } {
  if (rows.length === 0) {
    return { ok: false, message: "Add at least one sale day." };
  }
  if (rows.length > 4) {
    return { ok: false, message: "You can add up to four sale days." };
  }

  const dayIndexes = rows.map((r) => dayIndex(r.date));
  const seen = new Set<number>();
  for (const d of dayIndexes) {
    if (seen.has(d)) {
      return { ok: false, message: "Each calendar day can only appear once." };
    }
    seen.add(d);
  }

  const sorted = [...dayIndexes].sort((a, b) => a - b);
  const min = sorted[0]!;
  const max = sorted[sorted.length - 1]!;
  const span = max - min + 1;
  if (span !== sorted.length) {
    return {
      ok: false,
      message: "Sale days must be consecutive with no gaps.",
    };
  }

  for (const r of rows) {
    if (r.startTime >= r.endTime) {
      return {
        ok: false,
        message: `End time must be after start time on ${r.date}.`,
      };
    }
  }

  return { ok: true };
}

export const saleStepScheduleRefinedSchema = saleStepScheduleSchema.superRefine(
  (data, ctx) => {
    const v = validateConsecutiveSaleDates(data.saleDates);
    if (!v.ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: v.message,
        path: ["saleDates"],
      });
    }
  },
);
