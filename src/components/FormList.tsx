import React, { useEffect, useState } from 'react';
import { formRepository, FormSchema } from '../repositories/formRepository';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface FormListProps {
  onEdit: (form: FormSchema) => void;
}

const FormList: React.FC<FormListProps> = ({ onEdit }) => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    formRepository.getAll()
      .then(setForms)
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const openDeleteModal = (formId: number) => {
    setPendingDeleteId(formId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPendingDeleteId(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await formRepository.delete(pendingDeleteId);
      setForms(forms => forms.filter(f => f.id !== pendingDeleteId));
      toast.success('Form deleted successfully.');
    } catch (e) {
      toast.error('Failed to delete form.');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        {forms.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-400 text-base font-normal">No forms found.</span>
        ) : (
          <>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-semibold align-middle">
              {forms.length}
            </span>
            {forms.length === 1 ? 'form showing' : 'forms showing'}
          </>
        )}
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto border border-gray-200 dark:border-gray-800">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <table className="w-full min-w-[700px]">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '55%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 whitespace-nowrap">Title</th>
                <th className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Description</th>
                <th className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, idx) => (
                <tr
                  key={form.id}
                  className={
                    `transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950'} hover:bg-blue-50 dark:hover:bg-gray-800`
                  }
                >
                  <td className="px-8 py-4 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">{form.title}</td>
                  <td className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">{form.description}</td>
                  <td className="px-8 py-4 text-center border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          onEdit(form);
                          navigate('/builder');
                        }}
                        title="Edit"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-800 dark:hover:text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(form.id)}
                        title="Delete"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-800 dark:hover:text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    {/* Delete Confirmation Modal */}
    {deleteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-sm w-full border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Delete Form</h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this form? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default FormList;