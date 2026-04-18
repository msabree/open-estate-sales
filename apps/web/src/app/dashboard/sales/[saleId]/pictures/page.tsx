import { getSaleForOperator } from "@/app/dashboard/actions";
import {
  getSalePhotosState,
  type SalePhotosState,
} from "@/app/dashboard/sale-photos-actions";
import SalePicturesStep from "@/components/operator/SalePicturesStep";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ saleId: string }> };

export default async function OperatorSalePicturesPage({ params }: Props) {
  const { saleId } = await params;
  const result = await getSaleForOperator(saleId);

  if (!result.ok || !result.data) {
    notFound();
  }

  const photos = await getSalePhotosState(saleId);
  const emptyPhotosState: SalePhotosState = {
    photos: [],
    publicUrls: [],
    tier: "free",
  };
  const photosState: SalePhotosState =
    photos.ok && photos.data !== undefined ? photos.data : emptyPhotosState;

  return (
    <SalePicturesStep
      saleId={saleId}
      initial={result.data}
      photosState={photosState}
    />
  );
}
