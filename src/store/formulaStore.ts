import { create } from 'zustand';
import { FormulaState, FormulaTag, isNumber, isOperator } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useFormulaStore = create<FormulaState>((set, get) => ({
  tags: [],
  inputValue: '',
  cursorPosition: 0,

  addTag: (tag: FormulaTag) => {
    set(state => ({
      tags: [...state.tags, tag],
      inputValue: ''
    }));
  },

  removeTag: (index: number) => {
    set(state => ({
      tags: state.tags.filter((_, i) => i !== index)
    }));
  },

  updateInputValue: (value: string) => {
    set({ inputValue: value });

    if (value.length === 1) {
      if (isOperator(value)) {
        const operatorTag: FormulaTag = {
          id: uuidv4(),
          type: 'operator',
          value
        };
        
        get().addTag(operatorTag);
      } else if (isNumber(value)) {
        const numberTag: FormulaTag = {
          id: uuidv4(),
          type: 'number',
          value
        };
        
        get().addTag(numberTag);
      }
    }
  },

  setCursorPosition: (position: number) => {
    set({ cursorPosition: position });
  },

  calculateFormula: () => {
    const { tags } = get();
    
    const dummyVariables = {
      x: 10,
      y: 5,
      z: 3,
      price: 100,
      tax: 20,
      discount: 15
    };
    
    let formulaString = '';
    
    for (const varName in dummyVariables) {
      if (Object.prototype.hasOwnProperty.call(dummyVariables, varName)) {
        formulaString += `var ${varName} = ${dummyVariables[varName]}; `;
      }
    }
    
    formulaString += 'return ' + tags.map(tag => {
      if (tag.type === 'tag' && tag.reference) {
        const value = tag.reference.value;
        return value !== undefined && value !== '' ? value : 0;
      } else if (tag.type === 'variable') {
        return tag.value;
      } else if (tag.type === 'number' && tag.value.toString().endsWith('%')) {
        const percentValue = tag.value.toString().replace('%', '');
        return `(${percentValue}/100)`;
      } else {
        return tag.value;
      }
    }).join(' ');

    try {
      const calculationFn = new Function(formulaString);
      return calculationFn();
    } catch (error) {
      console.error('Error calculating formula:', error);
      return 'Error';
    }
  }
})); 