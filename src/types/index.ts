export interface SuggestionItem {
  id: string;
  name: string;
  category: string;
  value: string | number;
  inputs?: string;
}

export interface FormulaTag {
  id: string;
  type: 'tag' | 'operator' | 'number' | 'variable';
  value: string;
  reference?: SuggestionItem;
}

export interface FormulaState {
  tags: FormulaTag[];
  inputValue: string;
  cursorPosition: number;
  addTag: (tag: FormulaTag) => void;
  removeTag: (index: number) => void;
  updateInputValue: (value: string) => void;
  setCursorPosition: (position: number) => void;
  calculateFormula: () => number | string;
}

export type Operator = '+' | '-' | '*' | '/' | '^' | '(' | ')' | '%';

export const isOperator = (char: string): char is Operator => {
  return ['+', '-', '*', '/', '^', '(', ')', '%'].includes(char);
};

export const isNumber = (str: string): boolean => {
  return /^\d+$/.test(str);
}; 