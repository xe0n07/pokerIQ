"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutClient({ initialAmount }: { initialAmount: number }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const amount = initialAmount;

  useEffect(() => {
    if (isNaN(amount) || amount <= 0) {
      router.replace("/shop/checkout?amount=10000");
    }
  }, [amount, router]);

  const startPayment = () => {
    setProcessing(true);
    window.setTimeout(() => {
      router.push(`/shop/confirm?status=success&amount=${amount}`);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07120f] to-[#03110d] px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/8 bg-[#08140f]/95 p-6 shadow-xl shop-checkout">
        <div className="text-2xl font-semibold">Complete Purchase</div>
        <p className="mt-2 text-sm text-[#B8C7BB]">Buy virtual chips to continue your missions. No real-money gambling.</p>

        <div className="mt-6 flex items-center gap-4">
          <img src="/images/shop-bundle-10k.png" alt="10k chips" className="h-20 w-20 rounded-lg object-cover" />
          <div>
            <div className="text-lg font-semibold text-white">10,000 Chips</div>
            <div className="mt-1 text-sm text-amber-300">${(amount / 1000).toFixed(2)} (demo price)</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-[#B8C7BB]">Payment method</div>
          <div className="mt-2 flex gap-2">
            <button className="flex-1 rounded-md border border-white/10 px-4 py-3 text-sm text-white/90">Card</button>
            <button className="rounded-md border border-white/10 px-4 py-3 text-sm text-white/90">Apple Pay</button>
            <button className="rounded-md border border-white/10 px-4 py-3 text-sm text-white/90">Google Pay</button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={startPayment}
            disabled={processing}
            className="flex-1 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black shadow hover:brightness-95 disabled:opacity-60"
          >
            {processing ? "Processing…" : `Pay $${(amount / 1000).toFixed(2)}`}
          </button>
          <button onClick={() => router.push("/game")} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-[#B8C7BB]" disabled={processing}>
            Cancel
          </button>
        </div>

        <p className="mt-4 text-xs text-[#9fb29a]">Demo checkout. Integrate PCI-compliant provider for production. Chips are virtual.</p>
      </div>
    </div>
  );
}