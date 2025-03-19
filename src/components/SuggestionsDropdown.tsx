import React from 'react';
import { SuggestionItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useFormulaStore } from '../store/formulaStore';

interface SuggestionsDropdownProps {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  onClose: () => void;
}

export const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  suggestions,
  isLoading,
  onClose
}) => {
  const { addTag } = useFormulaStore();

  const handleSelectSuggestion = (suggestion: SuggestionItem) => {
    addTag({
      id: uuidv4(),
      type: 'tag',
      value: suggestion.name,
      reference: suggestion
    });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="formula-dropdown" style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        maxHeight: '16rem',
        backgroundColor: 'white',
        overflow: 'auto'
      }}>
        <div style={{padding: '0.5rem'}}>Loading...</div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="formula-dropdown" style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        maxHeight: '16rem',
        backgroundColor: 'white',
        overflow: 'auto'
      }}>
        <div style={{padding: '0.5rem'}}>No results found</div>
      </div>
    );
  }

  return (
    <div className="formula-dropdown" style={{
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      maxHeight: '16rem',
      backgroundColor: 'white',
      overflow: 'auto'
    }}>
      {suggestions.slice(0, 10).map((suggestion) => (
        <div
          key={suggestion.id}
          className="formula-dropdown-item"
          style={{
            padding: '0.625rem 0.75rem',
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.15s ease',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          onClick={() => handleSelectSuggestion(suggestion)}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontWeight: '500', color: '#374151'}}>{suggestion.name}</span>
              {suggestion.value !== undefined && suggestion.value !== '' && (
                <span style={{
                  color: '#6b7280', 
                  fontSize: '0.8125rem',
                  backgroundColor: '#f3f4f6',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem'
                }}>
                  ({suggestion.value})
                </span>
              )}
            </div>
            <span style={{color: '#6b7280', fontSize: '0.8125rem'}}>{suggestion.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}; 