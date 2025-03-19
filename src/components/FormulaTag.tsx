import React, { useState, useRef } from 'react';
import { FormulaTag as FormulaTagType, SuggestionItem } from '../types';
import { useFormulaStore } from '../store/formulaStore';
import { useSuggestions } from '../hooks/useSuggestions';

interface FormulaTagProps {
  tag: FormulaTagType;
  index: number;
}

export const FormulaTag: React.FC<FormulaTagProps> = ({ tag, index }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { removeTag } = useFormulaStore();
  const { suggestions, isLoading } = useSuggestions();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTagStyles = () => {
    switch (tag.type) {
      case 'operator':
        return { 
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          color: '#4b5563'
        };
      case 'number':
        if (tag.value.toString().endsWith('%')) {
          return { 
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe',
            color: '#2563eb'
          };
        } else {
          return { 
            backgroundColor: '#f0fdf4',
            border: '1px solid #dcfce7',
            color: '#16a34a'
          };
        }
      case 'variable':
        return {
          backgroundColor: '#fff7ed',
          border: '1px solid #ffedd5',
          color: '#ea580c'
        };
      default:
        return { 
          backgroundColor: '#f5f3ff',
          border: '1px solid #ede9fe',
          color: '#7c3aed'
        };
    }
  };

  const handleRemoveTag = () => {
    removeTag(index);
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectSuggestion = (suggestion: SuggestionItem) => {
    console.log("Selected suggestion:", suggestion);
    setIsDropdownOpen(false);
  };

  if (tag.type === 'operator' || tag.type === 'number') {
    return (
      <div 
        className="formula-tag" 
        style={{
          ...getTagStyles(),
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.9375rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          height: '1.75rem',
          userSelect: 'none',
          cursor: 'default'
        }}
        onClick={handleRemoveTag}
      >
        {tag.value}
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="formula-tag" 
        style={{
          ...getTagStyles(),
          padding: '0.25rem 0.5rem',
          paddingRight: '1.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.9375rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          height: '1.75rem',
          userSelect: 'none',
          cursor: 'default'
        }}
      >
        {tag.reference?.name || tag.value}
        <button
          style={{
            position: 'absolute',
            right: '0.25rem',
            width: '1rem',
            height: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleDropdownToggle}
        >
          <svg
            style={{
              width: '0.75rem',
              height: '0.75rem'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div ref={dropdownRef} className="formula-dropdown" style={{left: 0}}>
            {isLoading ? (
              <div style={{padding: '0.5rem'}}>Loading...</div>
            ) : suggestions.length === 0 ? (
              <div style={{padding: '0.5rem'}}>No results found</div>
            ) : (
              suggestions.slice(0, 10).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="formula-dropdown-item"
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 