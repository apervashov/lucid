import React, { useState, useRef, useEffect } from 'react';
import { FormulaTag } from './FormulaTag';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { useFormulaStore } from '../store/formulaStore';
import { useSuggestions } from '../hooks/useSuggestions';
import { v4 as uuidv4 } from 'uuid';
import { isOperator, isNumber } from '../types';

export const FormulaInput: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tags, inputValue, updateInputValue, addTag, removeTag, calculateFormula } = useFormulaStore();
  const { suggestions, isLoading, setSearchQuery } = useSuggestions();
  const [result, setResult] = useState<string | number>('');

  // Handle input in the field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If a space is entered and there is text before it, add a tag
    if (value.endsWith(' ') && value.trim()) {
      const trimmedValue = value.trim();
      
      // Check if the input is an operator
      if (isOperator(trimmedValue)) {
        addTag({
          id: uuidv4(),
          type: 'operator',
          value: trimmedValue
        });
      }
      // Check if the input is a number or percentage
      else if (isNumber(trimmedValue) || /^\d+%$/.test(trimmedValue)) {
        addTag({
          id: uuidv4(),
          type: 'number',
          value: trimmedValue
        });
      }
      // Check if the input is a variable (x, y, z, discount, etc.)
      else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedValue)) {
        addTag({
          id: uuidv4(),
          type: 'variable',
          value: trimmedValue
        });
      }
      // Otherwise process as plain text
      else {
        addTag({
          id: uuidv4(),
          type: 'tag',
          value: trimmedValue
        });
      }
      updateInputValue('');
    } else {
      updateInputValue(value);
      setSearchQuery(value);
      
      if (value.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      e.preventDefault();
      // Delete the last tag when Backspace is pressed in an empty field
      removeTag(tags.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (inputValue.trim()) {
        e.preventDefault();
        
        // Check if the input is an operator
        if (isOperator(inputValue)) {
          addTag({
            id: uuidv4(),
            type: 'operator',
            value: inputValue
          });
        }
        // Check if the input is a number or percentage
        else if (isNumber(inputValue) || /^\d+%$/.test(inputValue)) {
          addTag({
            id: uuidv4(),
            type: 'number',
            value: inputValue
          });
        }
        // Check if the input is a variable (x, y, z, discount, etc.)
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(inputValue)) {
          addTag({
            id: uuidv4(),
            type: 'variable',
            value: inputValue
          });
        }
        // Otherwise process as plain text
        else {
          addTag({
            id: uuidv4(),
            type: 'tag',
            value: inputValue
          });
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === '=' && tags.length > 0) {
      e.preventDefault();
      const calculatedResult = calculateFormula();
      setResult(calculatedResult);
    } else if (['+', '-', '*', '/', '^', '(', ')', '%'].includes(e.key)) {
      e.preventDefault();
      // If there is input, first add it as a tag or variable
      if (inputValue.trim()) {
        if (isNumber(inputValue) || /^\d+%$/.test(inputValue)) {
          addTag({
            id: uuidv4(),
            type: 'number',
            value: inputValue
          });
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(inputValue)) {
          addTag({
            id: uuidv4(),
            type: 'variable',
            value: inputValue
          });
        } else {
          addTag({
            id: uuidv4(),
            type: 'tag',
            value: inputValue
          });
        }
      }
      
      // Then add the operator
      addTag({
        id: uuidv4(),
        type: 'operator',
        value: e.key
      });
    }
  };

  // Handle focus on the input field
  const handleFocus = () => {
    setIsFocused(true);
    if (inputValue) {
      setShowSuggestions(true);
    }
  };

  // Handle loss of focus
  const handleBlur = () => {
    // Use setTimeout to allow processing clicks on dropdown items
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  // Handle click on the container - focus on the input field
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Close the dropdown after selecting an item
  const handleCloseDropdown = () => {
    setShowSuggestions(false);
  };

  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      margin: '0 auto',
      boxSizing: 'border-box',
      padding: '1.5rem'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          color: '#4b5563', 
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          Formula
        </label>
        <div 
          className="formula-input"
          style={{ 
            borderColor: isFocused ? '#3b82f6' : '#e5e7eb',
            boxShadow: isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
            transition: 'all 0.15s ease',
            padding: '0.75rem',
            minHeight: '2.5rem',
            flexWrap: 'wrap',
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            background: 'white',
            borderRadius: '0.375rem',
            alignItems: 'center',
            gap: '0.375rem'
          }}
          onClick={handleContainerClick}
        >
          {tags.map((tag, index) => (
            <FormulaTag key={tag.id} tag={tag} index={index} />
          ))}
          <div style={{ 
            position: 'relative', 
            flexGrow: 1, 
            minWidth: '120px',
            boxSizing: 'border-box'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                outline: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '0.9375rem',
                padding: '0.25rem 0',
                boxSizing: 'border-box',
                color: '#374151',
                caretColor: '#3b82f6'
              }}
              placeholder={tags.length > 0 ? "" : "Enter value or formula..."}
            />
            {showSuggestions && (
              <div style={{ 
                position: 'absolute', 
                zIndex: 10, 
                left: 0, 
                right: 0, 
                marginTop: '0.5rem',
                width: '100%'
              }}>
                <SuggestionsDropdown
                  suggestions={suggestions}
                  isLoading={isLoading}
                  onClose={handleCloseDropdown}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {result !== '' && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            color: '#6b7280', 
            marginBottom: '0.375rem', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Result</div>
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: '#111827',
            overflowWrap: 'break-word',
            wordWrap: 'break-word'
          }}>{result}</div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '1.5rem', 
        display: 'flex', 
        justifyContent: 'flex-start',
        width: '100%'
      }}>
        <button 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          onClick={() => setResult(calculateFormula())}
        >
          Calculate
        </button>
      </div>
    </div>
  );
}; 