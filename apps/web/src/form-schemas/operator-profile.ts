import { z } from "zod";

export const operatorKindSchema = z.enum(["individual", "company"]);

export const operatorProfileSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    city: z.string().trim().max(80).optional().or(z.literal("")),
    state: z.string().trim().max(2).optional().or(z.literal("")),
    operator_kind: operatorKindSchema,
    company_name: z.string().trim().max(160).optional().or(z.literal("")),
    company_logo_url: z.string().trim().max(2048).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.operator_kind === "company") {
      if (!data.company_name?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["company_name"],
          message: "Company name is required when you sell as a company.",
        });
      }
    }
    const logo = data.company_logo_url?.trim();
    if (data.operator_kind === "company" && logo) {
      try {
        const u = new URL(logo);
        if (u.protocol !== "https:") {
          ctx.addIssue({
            code: "custom",
            path: ["company_logo_url"],
            message: "Logo URL must use https.",
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["company_logo_url"],
          message: "Enter a valid https image URL.",
        });
      }
    }
  });

export type OperatorProfileFormValues = z.infer<typeof operatorProfileSchema>;
