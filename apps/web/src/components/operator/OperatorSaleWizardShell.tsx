"use client";

import { SaleCreationStepper } from "@/components/operator/SaleCreationStepper";
import { saleCreationSteps } from "@/utils/sale-creation-steps";

type Props = {
  saleId: string;
  draftTitle: string;
  heading: string;
  description?: string;
  children: React.ReactNode;
};

export function OperatorSaleWizardShell({
  saleId,
  draftTitle,
  heading,
  description,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <SaleCreationStepper steps={[...saleCreationSteps(saleId)]} />
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Draft · {draftTitle}
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-foreground">
        {heading}
      </h1>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
