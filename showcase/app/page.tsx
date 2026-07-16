import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { NewsHub } from "@/components/NewsHub";
import { MLEngine } from "@/components/MLEngine";
import { Literature } from "@/components/Literature";
import { Architecture } from "@/components/Architecture";
import { Performance } from "@/components/Performance";
import { TeamSection } from "@/components/TeamSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <NewsHub />
      <MLEngine />
      <Literature />
      <Architecture />
      <Performance />
      <TeamSection />
      <Footer />
    </main>
  );
}
