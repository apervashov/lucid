import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions, filterSuggestions } from '../api/suggestionsApi';
import { useState, useMemo } from 'react';

export const useSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allSuggestions, isLoading, error } = useQuery({
    queryKey: ['suggestions'],
    queryFn: fetchSuggestions
  });


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