import { getSaleForOperator } from "@/app/dashboard/actions";
import SaleDatesForm from "@/components/operator/SaleDatesForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ saleId: string }> };

export default async function OperatorSaleDatesPage({ params }: Props) {
  const { saleId } = await params;
  const result = await getSaleForOperator(saleId);

  if (!result.ok || !result.data) {
    notFound();
  }

  return <SaleDatesForm saleId={saleId} initial={result.data} />;
}
