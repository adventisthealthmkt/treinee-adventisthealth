import { useState, useEffect, useRef } from "react";
import { Languages } from "lucide-react";

const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("pt");
  const ref = useRef<HTMLDivElement>(null);

  // Load Google Translate script once
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "pt,es,en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectLanguage = (code: string) => {
    setCurrent(code);
    setOpen(false);

    // Trigger Google Translate
    const select = document.querySelector<HTMLSelectElement>(
      "#google_translate_element select"
    );
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === current);

  return (
    <div ref={ref} className="relative">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-full bg-white shadow-lg hover:bg-accent font-semibold"
        aria-label="Traduzir página"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden lg:inline">{currentLang?.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px] animate-fade-in z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                current === lang.code
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
