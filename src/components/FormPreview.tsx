import React from 'react';
import { FormSchema } from '../types/form';

interface FormPreviewProps {
  schema: FormSchema;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    console.log('Form submitted with data:', data);
  };

  return (
    <div className="bg-theme-bg p-6 rounded-lg border border-theme-border">
      <h2 className="text-xl font-bold mb-2 text-theme-text">{schema.title}</h2>
      <p className="text-theme-text-secondary mb-6">{schema.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.fields.map((field, index) => {
          const commonProps = {
            id: field.name,
            name: field.name,
            required: field.required,
            placeholder: field.placeholder,
            className:
              'mt-1 block w-full rounded-md border-theme-border bg-theme-input text-theme-text',
          };

          return (
            <div key={index}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-theme-text"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {field.type === 'select' && (
                <select {...commonProps}>
                  <option value="">Select an option</option>
                  {field.options?.map((option, i) => (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className="mt-2 space-y-2">
                  {field.options?.map((option, i) => (
                    <label key={i} className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        className="text-blue-600 bg-theme-input border-theme-border"
                      />
                      <span className="ml-2 text-theme-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...commonProps}
                      defaultChecked={field.defaultValue}
                      className="rounded border-theme-border text-blue-600 bg-theme-input"
                    />
                    <span className="ml-2 text-theme-text">{field.label}</span>
                  </label>
                </div>
              )}

              {['text', 'number', 'email', 'password'].includes(field.type) && (
                <input type={field.type} {...commonProps} />
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {schema.submitLabel}
        </button>
      </form>
    </div>
  );
};

export default FormPreview;