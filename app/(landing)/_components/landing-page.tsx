import { CodeDemo } from "@app/(landing)/_components/code-demo";
import { Features } from "@app/(landing)/_components/features";
import { Footer } from "@app/(landing)/_components/footer";
import { Hero } from "@app/(landing)/_components/hero";
import { Navbar } from "@app/(landing)/_components/navbar";

export function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <Navbar />
      <Hero />
      <Features />
      <CodeDemo />
      <Footer />
    </div>
  );
}
