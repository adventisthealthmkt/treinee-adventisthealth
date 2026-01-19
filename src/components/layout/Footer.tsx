import { Heart } from "lucide-react";
import logoAHB from "@/assets/logo-ahb-branco.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="https://adventisthealth.com.br" target="_blank" rel="noopener noreferrer" className="block mb-4">
              <img 
                src={logoAHB} 
                alt="Adventist Health Brasil" 
                className="h-24 md:h-28 w-auto"
              />
            </a>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Servir, curar e salvar, promovendo a saúde física, mental, social e espiritual.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { label: "Sobre", href: "#sobre" },
                { label: "Objetivos", href: "#objetivos" },
                { label: "Nossa Rede", href: "#rede" },
                { label: "Instituições", href: "#instituicoes" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Parcerias Acadêmicas</h4>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Interessado em parcerias educacionais, estágios ou programas trainee?
            </p>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground hover:underline"
            >
              Entre em contato →
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} Adventist Health Brasil. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-sm text-primary-foreground/60">
            Feito com <Heart className="w-4 h-4 text-primary-foreground/80" /> para a vida
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
