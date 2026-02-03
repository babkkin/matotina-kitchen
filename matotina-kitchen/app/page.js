import Hero from "@/components/hero"
import Services from "@/components/services"
import Menu from "@/components/menu"
import About from "@/components/about"
import Contact from "@/components/contact"
import Header from "@/components/header";
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Menu />
      <About />
      <Contact />
    </div>
  );
}
