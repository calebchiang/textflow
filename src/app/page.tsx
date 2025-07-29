import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <Hero />
      <SocialProof />
           <Features />
      <Benefits />
 
    </main>
  )
}
