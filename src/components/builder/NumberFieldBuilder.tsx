import React from 'react';
import { X } from 'lucide-react';
import { FormField } from '../../types/form';

interface NumberFieldBuilderProps {
  field: FormField;
  index: number;
  updateField: (index: number, field: FormField) => void;
}

const NumberFieldBuilder: React.FC<NumberFieldBuilderProps> = ({ field, index, updateField }) => {
  return (
    <div className="border border-theme-border rounded-md p-4 bg-theme-bg relative">
      <button
        onClick={() => updateField(index, { ...field, remove: true })}
        className="absolute top-2 right-2 text-theme-text-secondary hover:text-red-500"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-text">Field Type</label>
          <select
            value={field.type}
            onChange={e => updateField(index, { ...field, type: e.target.value as FormField['type'] })}
            className="mt-1 block w-full rounded-md border-theme-border bg-theme-input text-theme-text"
          >
            <option value="text">Text</option>
<option value="number">Number</option>
<option value="email">Email</option>
<option value="password">Password</option>
<option value="select">Select</option>
<option value="checkbox">Checkbox</option>
<option value="radio">Radio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-text">Field Name</label>
          <input
            type="text"
            value={field.name}
            onChange={e => updateField(index, { ...field, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-theme-border bg-theme-input text-theme-text"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-theme-text">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={e => updateField(index, { ...field, label: e.target.value })}
            className="mt-1 block w-full rounded-md border-theme-border bg-theme-input text-theme-text"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-theme-text">Placeholder</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={e => updateField(index, { ...field, placeholder: e.target.value })}
            className="mt-1 block w-full rounded-md border-theme-border bg-theme-input text-theme-text"
          />
        </div>
        <div className="col-span-2 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={e => updateField(index, { ...field, required: e.target.checked })}
              className="rounded border-theme-border text-blue-600"
            />
            <span className="ml-2 text-sm text-theme-text-secondary">Required</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NumberFieldBuilder;
