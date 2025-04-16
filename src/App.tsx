import React from 'react';
import FormBuilder from './components/FormBuilder';
import FormList from './components/FormList';
import NavBar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [selectedForm, setSelectedForm] = React.useState<any | null>(null);
  const [previewActive, setPreviewActive] = React.useState(false);

  // Handler for editing a form from the list
  const handleEdit = (form: any) => {
    // Parse schema_json to get fields and submitLabel
    let schemaJson = { fields: [], submitLabel: 'Submit' };
    try {
      schemaJson = JSON.parse(form.schema_json);
    } catch (e) {}
    setSelectedForm({
      id: form.id,
      title: form.title,
      description: form.description,
      fields: schemaJson.fields,
      submitLabel: schemaJson.submitLabel || 'Submit',
    });
    setPreviewActive(true);
  };

  // Handler for clearing selection (e.g., after save or nav)
  const handleClear = () => {
    setSelectedForm(null);
    setPreviewActive(false);
  };

  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'rounded-lg shadow-lg px-4 py-3 text-sm font-medium',
          style: { boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' },
          success: {
            className: 'bg-green-600 text-white',
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            className: 'bg-red-600 text-white',
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
          loading: {
            className: 'bg-blue-600 text-white',
            iconTheme: {
              primary: '#2563eb',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-theme-bg text-theme-text">
        <NavBar onNewForm={() => { setSelectedForm(null); setPreviewActive(false); }} />
        <Routes>
          <Route path="/" element={<FormList onEdit={handleEdit} />} />
          <Route path="/builder" element={
            <FormBuilder
              initialSchema={selectedForm}
              previewDefault={previewActive}
              onClear={handleClear}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;