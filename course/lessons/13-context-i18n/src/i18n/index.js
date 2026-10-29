import { createContext, useContext } from 'react'
import el from './el'
import en from './en'

// Every language has the same keys (checked by i18n.test.js)
export const LANGUAGES = { el, en }

export const LanguageContext = createContext(null)

// { language, setLanguage, t, errorMessage } for the current language, see LanguageProvider
export const useTranslation = () => useContext(LanguageContext)
