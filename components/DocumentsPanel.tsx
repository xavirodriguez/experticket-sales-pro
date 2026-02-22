
import React, { useState } from 'react';
import { ExperticketConfig } from '../types';
import { useDocuments } from '../hooks/useDocuments';
import { XCircle } from 'lucide-react';
import DocumentSearch from './documents/DocumentSearch';
import DocumentList from './documents/DocumentList';

interface DocumentsPanelProps {
  config: ExperticketConfig;
}

const DocumentsPanel: React.FC<DocumentsPanelProps> = ({ config }) => {
  const { documents, loading, error, fetchDocuments } = useDocuments(config);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (id: string) => {
    await fetchDocuments(id);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Transaction Documents</h2>
        <p className="text-gray-500">Enter a Sale or Transaction ID to retrieve vouchers and tickets</p>
      </div>

      <DocumentSearch
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle size={18} />
          </div>
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <DocumentList
        documents={documents}
        hasSearched={hasSearched && !loading}
      />
    </div>
  );
};

export default DocumentsPanel;
