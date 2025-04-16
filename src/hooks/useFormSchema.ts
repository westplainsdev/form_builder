import { useState } from 'react';
import { FormField } from '../types/form';

export function useFormSchema(initialSchema?: any) {
  const [schema, setSchema] = useState<any>(initialSchema || {
    id: undefined,
    title: '',
    description: '',
    fields: [],
    submitLabel: 'Submit',
  });
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const addField = () => {
    setSchema((prev: any) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          type: 'text',
          name: `field${prev.fields.length + 1}`,
          label: `Field ${prev.fields.length + 1}`,
        },
      ],
    }));
    setShowValidationSummary(false);
  };

  const updateField = (index: number, field: FormField) => {
    setSchema((prev: any) => ({
      ...prev,
      fields: prev.fields.map((f: FormField, i: number) => (i === index ? field : f)),
    }));
    setShowValidationSummary(false);
  };

  const handleFieldEdit = (updater: (prev: any) => any): void => {
    setSchema((prev: any) => {
      setShowSavedBanner(false);
      setShowValidationSummary(false);
      return updater(prev);
    });
  };

  return {
    schema,
    setSchema,
    addField,
    updateField,
    handleFieldEdit,
    showSavedBanner,
    setShowSavedBanner,
    showValidationSummary,
    setShowValidationSummary,
  };
}
