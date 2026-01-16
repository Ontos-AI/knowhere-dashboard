import { Navbar } from "@/components/langingPage/Navbar";
import { Hero } from "@/components/langingPage/Hero";
import { Features } from "@/components/langingPage/Features";
import { CodeDemo } from "@/components/langingPage/CodeDemo";
import { Footer } from "@/components/langingPage/Footer";

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
