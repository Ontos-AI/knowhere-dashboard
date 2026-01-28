import { CodeDemo } from './code-demo'
import { Features } from './features'
import { Footer } from './footer'
import { Hero } from './hero'
import { Navbar } from './navbar'

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
