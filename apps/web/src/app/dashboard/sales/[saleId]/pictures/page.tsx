import { getSaleForOperator } from "@/app/dashboard/actions";
import SalePicturesStep from "@/components/operator/SalePicturesStep";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ saleId: string }> };

export default async function OperatorSalePicturesPage({ params }: Props) {
  const { saleId } = await params;
  const result = await getSaleForOperator(saleId);

  if (!result.ok || !result.data) {
    notFound();
  }

  return <SalePicturesStep saleId={saleId} initial={result.data} />;
}
