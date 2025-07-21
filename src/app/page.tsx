import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <Hero />
      <Benefits />
      <Features />
    </main>
  )
}
