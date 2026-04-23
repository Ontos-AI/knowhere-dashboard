import { Footer } from "@app/_(landing)/_components/footer";
import { Navbar } from "@app/_(landing)/_components/navbar";
import { ScrollProgressBar } from "@app/_(landing)/_components/scroll-progress-bar";
import type { Metadata } from "next";
import { KnowhereOpenClawPluginPage } from "@/app/_(landing)/claw/_components/knowhere-openclaw-plugin-page";

const pageLinks = [
  { label: "Overview", href: "#plugin-overview" },
  { label: "Workflow", href: "#workflow" },
  { label: "Integration", href: "#integration" },
  { label: "Docs", href: "https://docs.knowhereto.ai/" },
];

export const metadata: Metadata = {
  title: "Knowhere OpenClaw Plugin | Ground OpenClaw With Knowhere API",
  description:
    "Install the Knowhere OpenClaw plugin to turn complex documents into browse-first, citation-ready context inside OpenClaw.",
  alternates: {
    canonical: "/claw",
  },
  openGraph: {
    title: "Knowhere OpenClaw Plugin",
    description:
      "Ground OpenClaw with Knowhere result packages, browse-first retrieval, and citation-ready document context.",
    url: "https://knowhere.com/claw",
    siteName: "Knowhere",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowhere OpenClaw Plugin",
    description:
      "Install the Knowhere OpenClaw plugin to give OpenClaw agents browse-first document grounding.",
  },
};

export default function KnowhereOpenClawPluginRoute() {
  return (
    <div className="flex flex-col gap-0">
      <ScrollProgressBar />
      <Navbar customLinks={pageLinks} />
      <main className="min-h-screen">
        <KnowhereOpenClawPluginPage />
      </main>
      <Footer />
    </div>
  );
}
