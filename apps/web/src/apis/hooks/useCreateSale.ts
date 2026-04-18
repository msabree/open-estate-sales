"use client";

import { createSale } from "@/apis/data/sales-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sales", "create"],
    mutationFn: createSale,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
