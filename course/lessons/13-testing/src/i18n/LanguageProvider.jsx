import { useEffect, useState } from 'react'
import { LANGUAGES, LanguageContext } from './index'

const STORAGE_KEY = 'wizard-tracker-language'

// The saved choice, otherwise the device language, otherwise English
function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved in LANGUAGES) return saved
  } catch {
    // Storage unavailable: fall back to the device language
  }
  return navigator.language.startsWith('el') ? 'el' : 'en'
}

// Holds the current language for the whole app; components read it with useTranslation()
export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)
  const t = LANGUAGES[language]

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Storage unavailable: the choice lasts until the page closes
    }
  }, [language])

  // Validation returns { type, ...data }, this turns it into text
  const errorMessage = (error) => (error ? t.errors[error.type](error) : null)

  return <LanguageContext value={{ language, setLanguage, t, errorMessage }}>{children}</LanguageContext>
}
