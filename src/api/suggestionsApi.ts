import axios from 'axios';
import { SuggestionItem } from '../types';

const API_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';

export const fetchSuggestions = async (): Promise<SuggestionItem[]> => {
  try {
    const response = await axios.get<SuggestionItem[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const filterSuggestions = (
  suggestions: SuggestionItem[],
  query: string
): SuggestionItem[] => {
  if (!query) return suggestions;
  
  const lowerQuery = query.toLowerCase();
  return suggestions.filter(
    suggestion => 
      suggestion.name.toLowerCase().includes(lowerQuery) ||
      suggestion.category.toLowerCase().includes(lowerQuery)
  );
}; 