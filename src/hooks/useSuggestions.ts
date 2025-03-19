import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions, filterSuggestions } from '../api/suggestionsApi';
import { useState, useMemo } from 'react';
import { SuggestionItem } from '../types';

export const useSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Запрос на получение всех подсказок
  const { data: allSuggestions, isLoading, error } = useQuery({
    queryKey: ['suggestions'],
    queryFn: fetchSuggestions
  });

  // Фильтрация подсказок на основе поискового запроса
  const filteredSuggestions = useMemo(() => {
    if (!allSuggestions) return [];
    return filterSuggestions(allSuggestions, searchQuery);
  }, [allSuggestions, searchQuery]);

  return {
    suggestions: filteredSuggestions,
    isLoading,
    error,
    searchQuery,
    setSearchQuery
  };
}; 