export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldDependency {
  field: string;
  value: string;
}

export interface FormField {
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio';
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  options?: FormFieldOption[];
  dependsOn?: FormFieldDependency;
  defaultValue?: boolean;
  /**
   * Used internally by builder components to signal that this field should be removed from the schema.
   */
  remove?: boolean;
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
  submitLabel: string;
}