import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import InteractiveMap from "@/components/InteractiveMap";
import Products from "@/components/Products";
import Partners from "@/components/Partners";
import Founder from "@/components/Founder";
import Trust from "@/components/Trust";
import Budget from "@/components/Budget";
import Form from "@/components/Form";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Concept />
      <InteractiveMap />
      <Products />
      <Partners />
      <Founder />
      <Trust />
      <Budget />
      <Form />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
