import ScrollToTop from "@/components/ScrollToTop";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const FloatingActions = () => {
  return (
    <div className="fixed left-6 bottom-6 z-50 flex flex-col items-center gap-2">
      <LanguageSwitcher />
      <ScrollToTop />
    </div>
  );
};

export default FloatingActions;
