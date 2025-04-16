import React from 'react';
import { formRepository } from '../repositories/formRepository';
import { toast } from 'react-hot-toast';
import { Plus, Eye, EyeOff, Save, Upload } from 'lucide-react';
import { FormField } from '../types/form';
import FormPreview from './FormPreview';
import {
  TextFieldBuilder,
  NumberFieldBuilder,
  EmailFieldBuilder,
  PasswordFieldBuilder,
  SelectFieldBuilder,
  CheckboxFieldBuilder,
  RadioFieldBuilder,
} from './builder';
import { useValidation } from '../hooks/useValidation';
import { useFormSchema } from '../hooks/useFormSchema';
import { useFormSchemaFileIO } from '../hooks/useFormSchemaFileIO';

interface FormBuilderProps {
  initialSchema?: any;
  previewDefault?: boolean;
  onClear?: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ initialSchema, previewDefault = false, onClear }) => {
  // Use custom hooks for schema/fields and file IO
  const {
    schema,
    setSchema,
    addField,
    updateField,
    handleFieldEdit,
    showSavedBanner,
    setShowSavedBanner,
    showValidationSummary,
    setShowValidationSummary,
  } = useFormSchema(initialSchema);

  const {
    fileInputRef,
    handleFileUpload,
    handleDownload,
  } = useFormSchemaFileIO(setSchema);

  const fieldRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const { errors: validationErrors, isValid } = useValidation(schema.fields);
  const [showPreview, setShowPreview] = React.useState(previewDefault);

  React.useEffect(() => {
    if (initialSchema) {
      setSchema({
        ...initialSchema,
        id: initialSchema.id,
      });
      setShowPreview(previewDefault);
    }
  }, [initialSchema, previewDefault, setSchema]);

  const handleSave = async () => {
    setShowValidationSummary(true);
    if (!schema.fields || schema.fields.length === 0) {
      toast.error('Cannot save an empty form. Please add at least one field to your form before saving.');
      return;
    }
    if (!isValid) {
      setShowSavedBanner(false);
      toast.error('Please fix validation errors before saving.');
      return;
    }
    try {
      const payload = {
        title: schema.title,
        description: schema.description,
        schema_json: JSON.stringify({
          fields: schema.fields,
          submitLabel: schema.submitLabel,
        }),
      };
      if (schema.id) {
        await formRepository.update(schema.id, payload);
        toast.success('Form schema updated successfully!');
      } else {
        await formRepository.create(payload);
        toast.success('Form schema saved successfully!');
      }
      setShowSavedBanner(true);
      setShowValidationSummary(false);
      if (onClear) onClear();
    } catch (error) {
      console.error('Error saving schema:', error);
      toast.error('Something went wrong while saving your form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-theme-bg-secondary rounded-lg shadow-lg p-6">
          {showSavedBanner && (
            <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shadow border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                <span>Form saved! You can safely leave or continue editing.</span>
              </div>
              <button onClick={() => setShowSavedBanner(false)} className="ml-4 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white p-1 rounded-full focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          {showValidationSummary && validationErrors.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
              <div className="font-semibold mb-2">Validation Issues:</div>
              <ul className="list-disc ml-6">
                {validationErrors.map((issue: {label: string, issue: string}, idx: number) => (
                  <li key={idx}>
                    <b>{issue.label}:</b> {issue.issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-theme-text">Form Builder</h1>
            <div className="space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-theme-border rounded-md shadow-sm text-sm font-medium text-theme-text bg-theme-bg hover:bg-theme-bg-secondary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Schema
              </button>
              <button
                onClick={() => handleDownload(schema)}
                className="inline-flex items-center px-4 py-2 border border-theme-border rounded-md shadow-sm text-sm font-medium text-theme-text bg-theme-bg hover:bg-theme-bg-secondary"
              >
                <Save className="h-4 w-4 mr-2" />
                Download Schema
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 border border-theme-border rounded-md shadow-sm text-sm font-medium text-theme-text bg-theme-bg hover:bg-theme-bg-secondary"
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Form Title"
                  value={schema.title}
                  onChange={(e) =>
                    handleFieldEdit((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-theme-border rounded-md bg-theme-input text-theme-text"
                />
                <textarea
                  placeholder="Form Description"
                  value={schema.description}
                  onChange={(e) =>
                    handleFieldEdit((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-theme-border rounded-md bg-theme-input text-theme-text"
                  rows={3}
                />
              </div>

<div className="space-y-4">
  {schema.fields.map((field: FormField, index: number) => {
    const hasValidation = validationErrors.some((vi) => vi.index === index);
    const showFieldValidation = showValidationSummary && hasValidation;
    const fieldProps = { field, index, updateField: (i: number, f: FormField): void => {
      setShowSavedBanner(false);
      updateField(i, f);
    }};
    const wrapperProps = {
      ref: (el: HTMLDivElement | null) => (fieldRefs.current[index] = el),
      className: showFieldValidation ? 'border-2 border-yellow-400 rounded-md p-1' : undefined,
    };
    switch (field.type) {
      case 'text':
        return <div key={index} {...wrapperProps}><TextFieldBuilder {...fieldProps} /></div>;
      case 'number':
        return <div key={index} {...wrapperProps}><NumberFieldBuilder {...fieldProps} /></div>;
      case 'email':
        return <div key={index} {...wrapperProps}><EmailFieldBuilder {...fieldProps} /></div>;
      case 'password':
        return <div key={index} {...wrapperProps}><PasswordFieldBuilder {...fieldProps} /></div>;
      case 'select':
        return <div key={index} {...wrapperProps}><SelectFieldBuilder {...fieldProps} /></div>;
      case 'checkbox':
        return <div key={index} {...wrapperProps}><CheckboxFieldBuilder {...fieldProps} /></div>;
      case 'radio':
        return <div key={index} {...wrapperProps}><RadioFieldBuilder {...fieldProps} /></div>;
      default:
        return null;
    }
  })}
</div>

              <button
                onClick={addField}
                className="w-full flex justify-center items-center px-4 py-2 border border-theme-border rounded-md shadow-sm text-sm font-medium text-theme-text bg-theme-bg hover:bg-theme-bg-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </button>

              <div>
                <label className="block text-sm font-medium text-theme-text">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  value={schema.submitLabel}
                  onChange={(e) =>
                    handleFieldEdit((prev) => ({
                      ...prev,
                      submitLabel: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-theme-border bg-theme-bg text-theme-text px-4 py-2"
                />
              </div>
            </div>

            {showPreview && (
              <div className="border-l border-theme-border pl-6">
                <h2 className="text-lg font-medium text-theme-text mb-4">
                  Form Preview
                </h2>
                <FormPreview schema={schema} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;