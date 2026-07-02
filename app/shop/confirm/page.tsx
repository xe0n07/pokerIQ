import { ConfirmClient } from "./ConfirmClient";

type ConfirmPageProps = {
  searchParams?: Promise<{ status?: string | string[]; amount?: string | string[] }>;
};

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = await searchParams;
  const status = Array.isArray(params?.status) ? params.status[0] : params?.status ?? "failed";
  const amount = Number(Array.isArray(params?.amount) ? params.amount[0] : params?.amount ?? 0);

  return <ConfirmClient initialStatus={status} initialAmount={Number.isFinite(amount) ? amount : 0} />;
}