"use client";

import type { OperatorSaleWizard } from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { OperatorSaleWizardShell } from "@/components/operator/OperatorSaleWizardShell";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  saleId: string;
  initial: OperatorSaleWizard;
};

export default function SalePicturesStep({ saleId, initial }: Props) {
  const router = useRouter();

  return (
    <OperatorSaleWizardShell
      saleId={saleId}
      draftTitle={initial.title}
      heading="Pictures"
      description="Photo uploads will plug in here. You can publish now and add images later from your dashboard."
    >
      <div className="mt-8 w-full space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Gallery management is not wired in this step yet. Continue to publish your listing;
          you can add listing photos in a follow-up.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/dashboard/sales/${saleId}/dates`}
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
              onClick={() => router.push(`/dashboard/sales/${saleId}/publish`)}
              className="bg-accent font-semibold text-white hover:bg-accent/90"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </OperatorSaleWizardShell>
  );
}
