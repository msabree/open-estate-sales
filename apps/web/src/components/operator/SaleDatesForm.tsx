"use client";

import { updateSaleSchedule } from "@/apis/data/sales-client";
import type { OperatorSaleWizard } from "@/app/dashboard/actions";
import { OperatorSaleWizardShell } from "@/components/operator/OperatorSaleWizardShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saleStepScheduleRefinedSchema, type SaleDateRow } from "@/form-schemas/sale";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  saleId: string;
  initial: OperatorSaleWizard;
};

function addCalendarDay(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

function normalizeRows(initial: OperatorSaleWizard): SaleDateRow[] {
  const raw = initial.sale_dates_json;
  if (Array.isArray(raw) && raw.length > 0) {
    const out: SaleDateRow[] = [];
    for (const item of raw) {
      if (item && typeof item === "object" && "date" in item) {
        const o = item as Record<string, unknown>;
        if (
          typeof o.date === "string" &&
          typeof o.startTime === "string" &&
          typeof o.endTime === "string"
        ) {
          out.push({
            date: o.date,
            startTime: o.startTime,
            endTime: o.endTime,
          });
        }
      }
    }
    if (out.length) {
      return [...out].sort((a, b) => a.date.localeCompare(b.date));
    }
  }
  return [
    {
      date: initial.start_date,
      startTime: "09:00",
      endTime: "17:00",
    },
  ];
}

export default function SaleDatesForm({ saleId, initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<SaleDateRow[]>(() => normalizeRows(initial));
  const [previewNotes, setPreviewNotes] = useState(initial.preview_times ?? "");
  const [error, setError] = useState<string | null>(null);

  const defaultTimes = useMemo(() => rows[0] ?? { startTime: "09:00", endTime: "17:00" }, [rows]);

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

  const addDay = () => {
    if (rows.length >= 4) return;
    const last = rows[rows.length - 1]!;
    const nextDate = addCalendarDay(last.date, 1);
    setRows([
      ...rows,
      {
        date: nextDate,
        startTime: last.startTime,
        endTime: last.endTime,
      },
    ]);
  };

  const removeDay = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, patch: Partial<SaleDateRow>) => {
    setRows(
      rows.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  };

  const handleNext = () => {
    const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
    const parsed = saleStepScheduleRefinedSchema.safeParse({
      saleDates: sorted,
      previewNotes: previewNotes.trim() ? previewNotes : null,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your sale days.");
      return;
    }

    setError(null);
    mutation.mutate({
      saleId,
      saleDates: parsed.data.saleDates,
      previewNotes: parsed.data.previewNotes,
    });
  };

  return (
    <OperatorSaleWizardShell
      saleId={saleId}
      draftTitle={initial.title}
      heading="Sale dates"
      description="Add up to four consecutive sale days. Each day can have its own open hours."
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

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Sale days</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={addDay}
              disabled={rows.length >= 4}
            >
              <Plus className="size-4" aria-hidden />
              Add day
            </Button>
          </div>

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={`${row.date}-${index}`}
                className="rounded-xl border border-border bg-muted/20 p-4 dark:bg-zinc-950/40"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Day {index + 1}
                  </span>
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label
                      className="text-xs font-medium text-foreground"
                      htmlFor={`sale-date-${index}`}
                    >
                      Date
                    </label>
                    <Input
                      id={`sale-date-${index}`}
                      type="date"
                      value={row.date}
                      onChange={(e) => updateRow(index, { date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-xs font-medium text-foreground"
                      htmlFor={`start-${index}`}
                    >
                      Opens
                    </label>
                    <Input
                      id={`start-${index}`}
                      type="time"
                      value={row.startTime}
                      onChange={(e) => updateRow(index, { startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-xs font-medium text-foreground"
                      htmlFor={`end-${index}`}
                    >
                      Closes
                    </label>
                    <Input
                      id={`end-${index}`}
                      type="time"
                      value={row.endTime}
                      onChange={(e) => updateRow(index, { endTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Days must be consecutive calendar dates (no gaps). Default hours{" "}
            {defaultTimes.startTime}–{defaultTimes.endTime} when you add a day.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="preview-notes" className="text-sm font-medium text-foreground">
            Preview / appointment notes (optional)
          </label>
          <textarea
            id="preview-notes"
            value={previewNotes}
            onChange={(e) => setPreviewNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Preview by appointment only; line forms at 8am on Saturday…"
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
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
              className="bg-accent font-semibold text-white hover:bg-accent/90"
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
