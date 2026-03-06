import { Heart } from "lucide-react";
import logoAHB from "@/assets/logo-ahb-branco.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="https://adventisthealth.com.br" target="_blank" rel="noopener noreferrer" className="inline-block mb-3 md:mb-4">
              <img src={logoAHB} alt="Adventist Health Brasil" className="h-20 md:h-28 w-auto mx-auto md:mx-0" />
            </a>
            <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">
              Servir, curar e salvar, promovendo a saúde física, mental, social e espiritual.
            </p>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4 text-primary-foreground text-sm md:text-base">Links Rápidos</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {[
                { label: "Sobre", href: "#sobre" },
                { label: "Objetivos", href: "#objetivos" },
                { label: "Nossa Rede", href: "#rede" },
                { label: "Instituições", href: "#instituicoes" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-xs md:text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4 text-primary-foreground text-sm md:text-base">Parcerias Acadêmicas</h4>
            <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
              Interessado em parcerias educacionais, estágios ou programas trainee?
            </p>
            <a href="#contato" className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-primary-foreground hover:underline">
              Entre em contato →
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 md:pt-8 border-t border-primary-foreground/10 text-center md:text-left">
          <p className="text-xs md:text-sm text-primary-foreground/60">
            © {currentYear} Adventist Health Brasil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
