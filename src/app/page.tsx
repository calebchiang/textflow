import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import AudienceComparison from "@/components/AudienceComparison";
import CTA from "@/components/CTA";
import Pricing from "@/components/Pricing";
import TollFreeNumber from "@/components/TollFreeNumber";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <Hero />
      <SocialProof />
      <Features  />
      <TollFreeNumber />
      <Pricing />
      {/* <AudienceComparison />  */}
      <CTA />
    </main>
  )
}
