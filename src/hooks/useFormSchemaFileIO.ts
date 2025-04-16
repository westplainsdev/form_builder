import { useRef } from 'react';

export function useFormSchemaFileIO(setSchema: (schema: any) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedSchema = JSON.parse(e.target?.result as string);
        setSchema(uploadedSchema);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (schema: any) => {
  // Only pick serializable fields to avoid circular structure errors
  const { id, title, description, fields, submitLabel } = schema;
  const serializableSchema = { id, title, description, fields, submitLabel };
  const dataStr = JSON.stringify(serializableSchema, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  // Sanitize title for filename
  console.log('Download schema title:', title);
let fileTitle = typeof title === 'string' && title.trim().length > 0 ? title.trim() : 'form-schema';
fileTitle = fileTitle.replace(/[^a-z0-9\-_]+/gi, '_');
if (!fileTitle || fileTitle === '_') fileTitle = 'form-schema';
const filename = `${fileTitle}.json`;

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return {
    fileInputRef,
    handleFileUpload,
    handleDownload,
  };
}
