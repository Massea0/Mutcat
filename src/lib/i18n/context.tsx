'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from './translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string) => string
  locale: typeof translations.fr
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLanguageState(savedLang)
    } else {
      // Detect browser language
      const browserLang = navigator.language.startsWith('en') ? 'en' : 'fr'
      setLanguageState(browserLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let value: any = translations[language]
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        // Fallback to French if translation not found
        value = translations.fr
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k]
          } else {
            return path // Return the path if translation not found
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : path
  }

  const locale = translations[language]

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}