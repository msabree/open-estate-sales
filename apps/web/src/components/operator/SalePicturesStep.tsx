"use client";

import type { OperatorSaleWizard } from "@/app/dashboard/actions";
import type { SalePhotosState } from "@/app/dashboard/sale-photos-actions";
import { SalePhotoUploader } from "@/components/operator/SalePhotoUploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { OperatorSaleWizardShell } from "@/components/operator/OperatorSaleWizardShell";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  saleId: string;
  initial: OperatorSaleWizard;
  photosState: SalePhotosState;
};

export default function SalePicturesStep({
  saleId,
  initial,
  photosState,
}: Props) {
  const router = useRouter();

  return (
    <OperatorSaleWizardShell
      saleId={saleId}
      draftTitle={initial.title}
      heading="Pictures"
      description="Add photos of items and spaces—buyers discover faster with good images."
    >
      <div className="mt-8 w-full space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SalePhotoUploader
          saleId={saleId}
          operatorUserId={initial.operator_id}
          initialPhotos={photosState.photos}
          tier={photosState.tier}
        />

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
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </OperatorSaleWizardShell>
  );
}
