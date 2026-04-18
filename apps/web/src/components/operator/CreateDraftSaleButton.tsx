"use client";

import { useCreateSale } from "@/apis/hooks/useCreateSale";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateDraftSaleButton() {
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
        onClick={() => void handleClick()}
        disabled={createSale.isPending}
        className="bg-accent font-semibold text-white hover:bg-accent/90"
      >
        {createSale.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Creating…
          </>
        ) : (
          "New draft sale"
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
