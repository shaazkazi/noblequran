import axios from 'axios';

const API_URL = 'https://mp3quran.net/api/_english.php';

export const fetchReciters = async () => {
  const response = await axios.get(API_URL);
  const reciters = response.data.reciters;
  return reciters.sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchReciterDetails = async (reciterId) => {
  const response = await axios.get(API_URL);
  return response.data.reciters.find(r => r.id === reciterId);
};

export const fetchReciterSurahs = async (reciterId) => {
  const reciter = await fetchReciterDetails(reciterId);
  const surahs = reciter.suras.split(',').map(Number);
  
  return {
    reciter,
    surahs
  };
};

export const getAudioUrl = (reciter, surahNumber) => {
  const paddedNumber = surahNumber.toString().padStart(3, '0');
  return `${reciter.Server}/${paddedNumber}.mp3`;
};

export const isReciterSurahAvailable = (reciter, surahNumber) => {
  const availableSuras = reciter.suras.split(',').map(Number);
  return availableSuras.includes(Number(surahNumber));
};
