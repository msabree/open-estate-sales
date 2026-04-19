"use client";

import type { ComponentProps } from "react";

import { useCreateSale } from "@/apis/hooks/useCreateSale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  label?: string;
  size?: ComponentProps<typeof Button>["size"];
};

export function CreateDraftSaleButton({
  className,
  label = "New draft sale",
  size = "default",
}: Props) {
  const router = useRouter();
  const createSale = useCreateSale();

  function handleClick() {
    createSale.mutate(undefined, {
      onSuccess: (result) => {
        if (result.ok && result.data) {
          router.push(`/dashboard/sales/${result.data.saleId}/location`);
          router.refresh();
          return;
        }
      },
    });
  }

  const errorMessage =
    createSale.data?.ok === false ? createSale.data.message : null;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size={size}
        onClick={() => void handleClick()}
        disabled={createSale.isPending}
        className={cn(
          "bg-accent font-semibold text-white hover:bg-accent/90",
          className,
        )}
      >
        {createSale.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Creating…
          </>
        ) : (
          <>
            <Plus className="mr-2 size-4" aria-hidden />
            {label}
          </>
        )}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
