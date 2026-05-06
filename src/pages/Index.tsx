import { useEffect, useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { LangSwitcher } from "@/components/LangSwitcher";
import type { Lang } from "@/lib/i18n";

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<"welcome" | "chat">("welcome");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title =
      lang === "ar"
        ? "توريد — مساعد الشراء العام"
        : lang === "fr"
        ? "TAWREED — Assistant des marchés publics"
        : "TAWREED — Public Procurement AI";
  }, [lang]);

  return (
    <main className="relative">
      <div className="fixed top-4 end-4 z-50">
        <LangSwitcher current={lang} onChange={setLang} />
      </div>
      {view === "welcome" ? (
        <WelcomeScreen lang={lang} onStart={() => setView("chat")} />
      ) : (
        <ChatInterface lang={lang} onHome={() => setView("welcome")} />
      )}
    </main>
  );
};

export default Index;
