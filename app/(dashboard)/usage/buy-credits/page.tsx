import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ amount?: string }>;
};

// Backward-compatible fallback for legacy deep links.
// Global dashboard modal is now controlled by ?buy=true[&amount=X].
export default async function BuyCreditsPage({ searchParams }: Props) {
  const { amount } = await searchParams;
  const params = new URLSearchParams({ buy: "true" });
  if (amount) params.set("amount", amount);
  redirect(`/usage?${params.toString()}`);
}
