
import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface DocumentSearchProps {
  onSearch: (id: string) => void;
  loading: boolean;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch, loading }) => {
  const [id, setId] = useState('');

  const handleSubmit = () => {
    if (id) onSearch(id);
  };

  return (
    <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex items-center">
      <div className="flex-1 flex items-center px-4 space-x-3">
        <FileText className="text-gray-400" size={24} />
        <input
          type="text"
          className="w-full py-4 text-lg font-medium outline-none placeholder:text-gray-300"
          placeholder="e.g. 57614265090541..."
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !id}
        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Fetch Documents'}
      </button>
    </div>
  );
};

export default DocumentSearch;
