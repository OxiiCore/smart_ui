import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next with basic configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // English translations
          'app.home': 'Home',
          'app.forms': 'Forms',
          'app.workflow': 'Workflow',
          'loading.title': 'Loading...',
          'error.general': 'An error occurred',
          // Add more translations as needed
        }
      },
      vi: {
        translation: {
          // Vietnamese translations
          'app.home': 'Trang chủ',
          'app.forms': 'Biểu mẫu',
          'app.workflow': 'Quy trình',
          'loading.title': 'Đang tải...',
          'error.general': 'Đã xảy ra lỗi',
          // Add more translations as needed
        }
      }
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

interface I18nContextValue {
  language: string;
  changeLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextValue>({
  language: i18n.language,
  changeLanguage: () => {}
});

export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };

    // Listen to language changes
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <I18nContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  );
}