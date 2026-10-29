import { LANGUAGES, useTranslation } from '../i18n'

// ΕΛ / EN pill in the header; screen readers hear the full language name
export default function LanguageSwitch() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <div className="language" role="group" aria-label={t.language}>
      {Object.entries(LANGUAGES).map(([code, strings]) => (
        <button
          key={code}
          type="button"
          lang={code}
          className="language__option"
          aria-label={strings.languageName}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
        >
          {strings.languageShort}
        </button>
      ))}
    </div>
  )
}
