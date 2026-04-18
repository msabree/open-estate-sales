"use client";

import { updateSaleSchedule } from "@/apis/data/sales-client";
import type { OperatorSaleWizard } from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OperatorSaleWizardShell } from "@/components/operator/OperatorSaleWizardShell";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  saleId: string;
  initial: OperatorSaleWizard;
};

export default function SaleDatesForm({ saleId, initial }: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(initial.start_date);
  const [endDate, setEndDate] = useState(initial.end_date);
  const [previewTimes, setPreviewTimes] = useState(initial.preview_times ?? "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: updateSaleSchedule,
    onSuccess: (result) => {
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push(`/dashboard/sales/${saleId}/pictures`);
      router.refresh();
    },
    onError: () => {
      setError("Something went wrong. Try again.");
    },
  });

  const handleNext = () => {
    setError(null);
    mutation.mutate({
      saleId,
      startDate,
      endDate,
      previewTimes: previewTimes.trim() ? previewTimes : null,
    });
  };

  return (
    <OperatorSaleWizardShell
      saleId={saleId}
      draftTitle={initial.title}
      heading="Dates & previews"
      description="Sale window and optional preview / appointment notes."
    >
      <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {error ? (
          <div
            className="flex gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium text-foreground">
              Start date
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium text-foreground">
              End date
            </label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="preview-times" className="text-sm font-medium text-foreground">
            Preview times (optional)
          </label>
          <textarea
            id="preview-times"
            value={previewTimes}
            onChange={(e) => setPreviewTimes(e.target.value)}
            rows={4}
            placeholder="E.g. Preview Fri 9–12; first day opens 8am…"
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/dashboard/sales/${saleId}/details`}
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
