import { getSaleForOperator } from "@/app/dashboard/actions";
import SaleDetailsForm from "@/components/operator/SaleDetailsForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ saleId: string }> };

export default async function OperatorSaleDetailsPage({ params }: Props) {
  const { saleId } = await params;
  const result = await getSaleForOperator(saleId);

  if (!result.ok || !result.data) {
    notFound();
  }

  return <SaleDetailsForm saleId={saleId} initial={result.data} />;
}
