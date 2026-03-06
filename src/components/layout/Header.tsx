import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoAHB from "@/assets/logo-ahb-azul.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Sobre", href: "#sobre" },
    { label: "Objetivos", href: "#objetivos" },
    { label: "Rede", href: "#rede" },
    { label: "Instituições", href: "#instituicoes" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-card/98 backdrop-blur-lg shadow-sm" : "bg-card/95 backdrop-blur-md"
    } border-b border-border`}>
      <div className="section-container">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <a href="https://adventisthealth.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img src={logoAHB} alt="Adventist Health Brasil" className="h-16 md:h-24 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#contato">
              <Button variant="institutional" size="default">
                Parcerias Acadêmicas
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full screen overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-card z-40 animate-fade-in overflow-y-auto">
          <nav className="flex flex-col p-6 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-4 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
              <a href="#contato" onClick={() => setIsMenuOpen(false)}>
                <Button variant="institutional" size="lg" className="w-full">
                  Parcerias Acadêmicas
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
