import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { FutureOutlook } from "@/components/home/FutureOutlook";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section id="about">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="future">
          <FutureOutlook />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </>
  );
}
