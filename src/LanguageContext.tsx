import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "tr" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ser-language");
    return saved === "en" ? "en" : "tr";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: Language) => {
        setLanguage(next);
        localStorage.setItem("ser-language", next);
        document.documentElement.lang = next;
      },
      toggleLanguage: () => {
        const next = language === "tr" ? "en" : "tr";
        setLanguage(next);
        localStorage.setItem("ser-language", next);
        document.documentElement.lang = next;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
