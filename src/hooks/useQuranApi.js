import { useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'https://api.quran.com/api/v4';

export const useQuranApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSurahs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/chapters`);
      return response.data.chapters;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSurahDetails = useCallback(async (surahId, translation = 'en') => {
    setLoading(true);
    try {
      const [versesResponse, translationResponse] = await Promise.all([
        axios.get(`${BASE_URL}/verses/by_chapter/${surahId}`),
        axios.get(`${BASE_URL}/verses/by_chapter/${surahId}`, {
          params: {
            translations: translation,
            language: translation
          }
        })
      ]);
      
      return {
        verses: versesResponse.data.verses.map((verse, index) => ({
          ...verse,
          translation: translationResponse.data.verses[index].translations[0].text
        }))
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchSurahs,
    fetchSurahDetails
  };
};
