import { CheckoutClient } from "./CheckoutClient";

type CheckoutPageProps = {
  searchParams?: Promise<{ amount?: string | string[] }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const amount = Number(Array.isArray(params?.amount) ? params.amount[0] : params?.amount ?? 10000);

  return <CheckoutClient initialAmount={Number.isFinite(amount) && amount > 0 ? amount : 10000} />;
}