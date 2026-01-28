import { CodeDemo } from '@/components/langingPage/CodeDemo'
import { Features } from '@/components/langingPage/Features'
import { Footer } from '@/components/langingPage/Footer'
import { Hero } from '@/components/langingPage/Hero'
import { Navbar } from '@/components/langingPage/Navbar'

export function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <Navbar />
      <Hero />
      <Features />
      <CodeDemo />
      <Footer />
    </div>
  )
}
