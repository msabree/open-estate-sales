"use client";

import { updateSaleListingCopy } from "@/apis/data/sales-client";
import type { OperatorSaleWizard } from "@/app/dashboard/actions";
import { SaleDescriptionEditor } from "@/components/operator/SaleDescriptionEditor";
import { OperatorSaleWizardShell } from "@/components/operator/OperatorSaleWizardShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { saleStepCopySchema } from "@/form-schemas/sale";
import { cn } from "@/lib/utils";
import { plainTextFromHtml } from "@/utils/html";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function termsInitialPlain(termsHtml: string | null): string {
  if (!termsHtml?.trim()) return "";
  return termsHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Props = {
  saleId: string;
  initial: OperatorSaleWizard;
};

export default function SaleDetailsForm({ saleId, initial }: Props) {
  const router = useRouter();
  const [termsPlain, setTermsPlain] = useState(() =>
    termsInitialPlain(initial.terms_html),
  );
  const [descriptionHtml, setDescriptionHtml] = useState(
    initial.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: updateSaleListingCopy,
    onSuccess: (result) => {
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push(`/dashboard/sales/${saleId}/dates`);
      router.refresh();
    },
    onError: () => {
      setError("Something went wrong. Try again.");
    },
  });

  const handleNext = () => {
    const termsHtml =
      termsPlain.trim().length > 0
        ? termsPlain
            .trim()
            .split(/\n\s*\n/)
            .map((p) => `<p>${escapeTermsLine(p.trim())}</p>`)
            .join("")
        : null;

    const parsed = saleStepCopySchema.safeParse({
      termsHtml,
      descriptionHtml: descriptionHtml.trim() ? descriptionHtml : null,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    setError(null);
    mutation.mutate({
      saleId,
      termsHtml: parsed.data.termsHtml,
      descriptionHtml: parsed.data.descriptionHtml,
    });
  };

  return (
    <OperatorSaleWizardShell
      saleId={saleId}
      draftTitle={initial.title}
      heading="Listing copy"
      description="Terms shoppers must agree to, plus a full description of what you’re selling."
    >
      <div className="mt-8 w-full space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {error ? (
          <div
            className="flex gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="sale-terms" className="text-sm font-medium text-foreground">
            Terms &amp; conditions
          </label>
          <textarea
            id="sale-terms"
            value={termsPlain}
            onChange={(e) => setTermsPlain(e.target.value)}
            rows={8}
            placeholder="Payment types, returns, liability, COVID rules, etc."
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            )}
          />
          <p className="text-xs text-muted-foreground">
            Plain text for now; we format it for the public listing. Minimum 10 characters
            ({plainTextFromHtml(termsPlain).length} now).
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Description</span>
          <SaleDescriptionEditor
            saleId={saleId}
            initialHtml={initial.description ?? ""}
            onChange={setDescriptionHtml}
          />
          <p className="text-xs text-muted-foreground">
            Use bold, headings, and lists so buyers know what to expect. Minimum 20 characters
            ({plainTextFromHtml(descriptionHtml).length} now).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/dashboard/sales/${saleId}/location`}
            className={buttonVariants({ variant: "outline", size: "default" })}
          >
            Back
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost", size: "default" })}
            >
              Cancel
            </Link>
            <Button
              type="button"
              onClick={() => void handleNext()}
              disabled={mutation.isPending}
              className="bg-accent font-semibold text-zinc-950 hover:bg-accent/90"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </div>
    </OperatorSaleWizardShell>
  );
}

function escapeTermsLine(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}
