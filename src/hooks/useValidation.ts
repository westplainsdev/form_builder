import { useMemo } from 'react';
import { FormField } from '../types/form';

export interface ValidationIssue {
  index: number;
  label: string;
  issue: string;
}


export function useValidation(fields: FormField[]) {
  return useMemo(() => {
    const errors: ValidationIssue[] = [];
    const successes: number[] = [];
    fields.forEach((_field: any, i: number) => {
      // Only keep general validation here. Option validation is handled by the UI.
      // Add more field-type-specific validation here if needed
      successes.push(i);
    });
    return {
      errors,
      isValid: errors.length === 0,
      successes,
    };
  }, [fields]);
}
