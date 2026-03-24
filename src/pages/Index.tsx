import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ObjectivesSection from "@/components/sections/ObjectivesSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import StrategicPerspectivesSection from "@/components/sections/StrategicPerspectivesSection";
import NetworkMapSection from "@/components/sections/NetworkMapSection";
import InstitutionsSection from "@/components/sections/InstitutionsSection";
import ClosingSection from "@/components/sections/ClosingSection";
import FloatingActions from "@/components/FloatingActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ObjectivesSection />
        <EcosystemSection />
        <StrategicPerspectivesSection />
        <NetworkMapSection />
        <InstitutionsSection />
        <ClosingSection />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
