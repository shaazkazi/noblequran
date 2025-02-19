import axios from 'axios';

const BASE_URL = 'https://api.quran.com/api/v4';
const RECITER_BASE_URL = 'https://server6.mp3quran.net/download';

export const TRANSLATIONS = [
  // English
  { id: 131, language_name: 'english', name: 'Dr. Mustafa Khattab' },
  { id: 85, language_name: 'english', name: 'M.A.S. Abdel Haleem' },
  { id: 84, language_name: 'english', name: 'Mufti Taqi Usmani' },
  { id: 95, language_name: 'english', name: 'Maududi' },
  { id: 20, language_name: 'english', name: 'Saheeh International' },
  
  // Urdu
  { id: 234, language_name: 'urdu', name: 'Fatah Muhammad Jalandhari' },
  { id: 54, language_name: 'urdu', name: 'Muhammad Junagarhi' },
  { id: 97, language_name: 'urdu', name: 'Abu Al-Ala Maududi' },
  
  // Bengali
  { id: 161, language_name: 'bengali', name: 'Taisirul Quran' },
  
  // French
  { id: 31, language_name: 'french', name: 'Muhammad Hamidullah' },
  
  // Indonesian
  { id: 33, language_name: 'indonesian', name: 'Ministry of Religious Affairs' },
  
  // Turkish
  { id: 77, language_name: 'turkish', name: 'Diyanet İşleri' },
  
  // Spanish
  { id: 83, language_name: 'spanish', name: 'Sheikh Isa Garcia' },
  
  // German
  { id: 27, language_name: 'german', name: 'Bubenheim and Nadeem' },
  
  // Russian
  { id: 79, language_name: 'russian', name: 'Abu Adel' }
];

export const RECITERS = {
  akdr: {
    id: 'akdr',
    name: 'Ibrahim Al-Akdar',
    baseUrl: `${RECITER_BASE_URL}/akdr`
  },
  afs: {
    id: 'afs',
    name: 'Mishary Rashid Alafasy',
    baseUrl: `${RECITER_BASE_URL}/afs`
  }
};

export const fetchSurahs = async () => {
  const response = await axios.get(`${BASE_URL}/chapters`, {
    params: { language: 'en' }
  });
  return response.data.chapters;
};

export const fetchSurahDetails = async (surahId, translationId = null) => {
  if (!surahId) return null;

  const requests = [
    axios.get(`${BASE_URL}/verses/by_chapter/${surahId}`, {
      params: {
        fields: 'text_uthmani',
        per_page: 300
      }
    })
  ];

  if (translationId) {
    requests.push(
      axios.get(`${BASE_URL}/verses/by_chapter/${surahId}`, {
        params: {
          translations: translationId,
          per_page: 300
        }
      })
    );
  }

  const [versesResponse, translationResponse] = await Promise.all(requests);
  const paddedSurahNumber = surahId.toString().padStart(3, '0');
  const defaultReciterAudioUrl = `${RECITERS.akdr.baseUrl}/${paddedSurahNumber}.mp3`;

  const verses = versesResponse.data.verses.map((verse, index) => ({
    id: verse.id,
    number: verse.verse_number,
    text: verse.text_uthmani,
    verse_key: verse.verse_key,
    translation: translationId ? translationResponse.data.verses[index].translations[0].text : null
  }));

  return {
    verses,
    audioUrl: defaultReciterAudioUrl,
    reciter: RECITERS.akdr.name
  };
};

export const getReciterAudioUrl = (reciterId, surahNumber) => {
  const reciter = RECITERS[reciterId];
  if (!reciter) return null;
  
  const paddedNumber = surahNumber.toString().padStart(3, '0');
  return `${reciter.baseUrl}/${paddedNumber}.mp3`;
};
