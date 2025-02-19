import { TRANSLATIONS } from '../../services/quranApi';

const TranslationSelector = ({ value, onChange }) => {
  // Group translations by language for better organization
  const groupedTranslations = TRANSLATIONS.reduce((acc, translation) => {
    const lang = translation.language_name;
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(translation);
    return acc;
  }, {});

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="ios-select"
    >
      <option value="">Arabic Only</option>
      
      {Object.entries(groupedTranslations).map(([language, translations]) => (
        <optgroup key={language} label={language.charAt(0).toUpperCase() + language.slice(1)}>
          {translations.map(translation => (
            <option
              key={translation.id}
              value={translation.id}
            >
              {translation.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default TranslationSelector;
