import { getSaleForOperator } from "@/app/dashboard/actions";
import SalePublishForm from "@/components/operator/SalePublishForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ saleId: string }> };

export default async function OperatorSalePublishPage({ params }: Props) {
  const { saleId } = await params;
  const result = await getSaleForOperator(saleId);

  if (!result.ok || !result.data) {
    notFound();
  }

  return <SalePublishForm saleId={saleId} initial={result.data} />;
}
