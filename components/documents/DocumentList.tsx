
import React from 'react';
import { TransactionDocument } from '../../types';
import { ExternalLink, Search } from 'lucide-react';

interface DocumentListProps {
  documents: TransactionDocument[];
  hasSearched: boolean;
}

const DocumentItem: React.FC<{ doc: TransactionDocument }> = ({ doc }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm uppercase">
        {doc.LanguageCode}
      </div>
      <div>
        <h4 className="font-bold text-gray-900">Voucher / Ticket</h4>
        <p className="text-xs text-gray-500 font-medium">Available in {doc.LanguageCode.toUpperCase()}</p>
      </div>
    </div>
    <a
      href={doc.SalesDocumentUrl}
      target="_blank"
      rel="noreferrer"
      className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
    >
      <ExternalLink size={20} />
    </a>
  </div>
);

const DocumentList: React.FC<DocumentListProps> = ({ documents, hasSearched }) => {
  if (documents.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
        {documents.map((doc, idx) => (
          <DocumentItem key={idx} doc={doc} />
        ))}
      </div>
    );
  }

  if (hasSearched) {
    return (
      <div className="py-20 text-center opacity-40">
        <Search size={64} className="mx-auto mb-4" />
        <p className="font-bold text-lg">No documents found for this ID</p>
      </div>
    );
  }

  return null;
};

export default DocumentList;
