import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ObjectivesSection from "@/components/sections/ObjectivesSection";
import NetworkMapSection from "@/components/sections/NetworkMapSection";
import InstitutionsSection from "@/components/sections/InstitutionsSection";
import ClosingSection from "@/components/sections/ClosingSection";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ObjectivesSection />
        <NetworkMapSection />
        <InstitutionsSection />
        <ClosingSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
