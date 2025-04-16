import React from 'react';

export interface OptionItem {
  label: string;
  value: string;
}

interface OptionsEditorProps {
  options: OptionItem[];
  onChange: (options: OptionItem[]) => void;
  disabled?: boolean;
}

const emptyOption = { label: '', value: '' };

const OptionsEditor: React.FC<OptionsEditorProps> = ({ options, onChange, disabled }) => {
  const [localOptions, setLocalOptions] = React.useState<OptionItem[]>(options.length ? options : [emptyOption]);
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    setLocalOptions(options.length ? options : [emptyOption]);
  }, [options]);

  React.useEffect(() => {
    validate(localOptions);
  }, [localOptions]);

  const validate = (opts: OptionItem[]) => {
    const errs: string[] = [];
    const seenValues = new Set<string>();
    opts.forEach((opt, idx) => {
      if (!opt.label.trim()) {
        errs[idx] = 'Label required';
      } else if (!opt.value.trim()) {
        errs[idx] = 'Value required';
      } else if (seenValues.has(opt.value)) {
        errs[idx] = 'Duplicate value';
      } else {
        errs[idx] = '';
        seenValues.add(opt.value);
      }
    });
    setErrors(errs);
    return errs.every(e => !e);
  };

  const handleChange = (idx: number, key: keyof OptionItem, value: string) => {
    const newOptions = localOptions.map((opt, i) => i === idx ? { ...opt, [key]: value } : opt);
    setLocalOptions(newOptions);
    if (validate(newOptions)) {
      onChange(newOptions.filter(opt => opt.label && opt.value));
    }
  };

  const handleAdd = () => {
    setLocalOptions([...localOptions, emptyOption]);
  };

  const handleRemove = (idx: number) => {
    const newOptions = localOptions.filter((_, i) => i !== idx);
    setLocalOptions(newOptions.length ? newOptions : [emptyOption]);
    if (validate(newOptions)) {
      onChange(newOptions.filter(opt => opt.label && opt.value));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-theme-text mb-1">Options</label>
      <div className="space-y-2">
        {localOptions.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Label"
              value={opt.label}
              disabled={disabled}
              onChange={e => handleChange(idx, 'label', e.target.value)}
              className={`px-2 py-1 border rounded w-1/2 bg-theme-input text-theme-text ${errors[idx] && !opt.label ? 'border-red-500' : 'border-theme-border'}`}
            />
            <input
              type="text"
              placeholder="Value"
              value={opt.value}
              disabled={disabled}
              onChange={e => handleChange(idx, 'value', e.target.value)}
              className={`px-2 py-1 border rounded w-1/2 bg-theme-input text-theme-text ${errors[idx] && !opt.value ? 'border-red-500' : 'border-theme-border'}`}
            />
            <button
              type="button"
              className="text-red-500 hover:text-red-700 px-2"
              onClick={() => handleRemove(idx)}
              disabled={disabled || localOptions.length === 1}
              aria-label="Remove option"
            >
              ×
            </button>
            {errors[idx] && (
              <span className="text-xs text-red-500 ml-2">{errors[idx]}</span>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={disabled}
        >
          Add Option
        </button>
      </div>
    </div>
  );
};

export default OptionsEditor;
