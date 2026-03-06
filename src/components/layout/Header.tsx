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
            <img src={logoAHB} alt="Adventist Health Brasil" className="h-12 md:h-16 lg:h-24 w-auto" />
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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <a href="#contato">
              <Button variant="institutional" size="default">
                Parcerias acadêmicas
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors relative z-50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
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
        <div className="md:hidden absolute left-0 right-0 top-full bg-card border-b border-border shadow-lg animate-fade-in overflow-y-auto max-h-[calc(100vh-3.5rem)]">
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
            <div className="flex items-center justify-center pt-4 mt-2 border-t border-border">
              <a href="#contato" onClick={() => setIsMenuOpen(false)} className="flex-1">
                <Button variant="institutional" size="lg" className="w-full">
                  Parcerias acadêmicas
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
