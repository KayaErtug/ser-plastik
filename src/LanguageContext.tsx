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

    const metadata =
      language === "en"
        ? {
            title: "Ser Plastik | Plastic Packaging & Custom Production",
            description:
              "Ser Plastik manufactures courier bags, industrial packaging, plastic bags, garbage bags, transparent packaging and custom plastic packaging solutions.",
          }
        : {
            title: "Ser Plastik | Plastik Ambalaj ve Özel Üretim Çözümleri",
            description:
              "Ser Plastik; kargo poşetleri, endüstriyel ambalaj, naylon torbalar, çöp torbaları, jelatin ambalaj ve özel üretim plastik ambalaj çözümleri sunar.",
          };

    document.title = metadata.title;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = metadata.description;

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = metadata.title;

    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = metadata.description;
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
