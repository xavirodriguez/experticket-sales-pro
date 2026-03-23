
import { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, TransactionDocument } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Retrieves and manages document links for a specific transaction.
 *
 * @remarks
 * This hook allows fetching downloadable documents (such as PDF tickets)
 * associated with a completed Experticket transaction.
 *
 * @param config - The Experticket API configuration.
 * @returns An object containing the document list, loading/error states, and a fetch function.
 *
 * @example
 * ```tsx
 * function DocumentDownloader({ config, transactionId }) {
 *   const { documents, fetchDocuments, loading } = useDocuments(config);
 *
 *   useEffect(() => {
 *     fetchDocuments(transactionId);
 *   }, [transactionId, fetchDocuments]);
 *
 *   if (loading) return <div>Loading documents...</div>;
 *   return (
 *     <ul>
 *       {documents.map(doc => (
 *         <li key={doc.SalesDocumentUrl}><a href={doc.SalesDocumentUrl}>Download</a></li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useDocuments = (config: ExperticketConfig) => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<TransactionDocument[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Fetches document links (e.g., tickets) for the given transaction identifier.
   *
   * @param transactionId - The unique identifier of the transaction.
   * @returns A promise that resolves when the documents are fetched.
   */
  const fetchDocuments = useCallback(async (transactionId: string) => {
    if (!transactionId) return;

    try {
      setLoading(true);
      setErrorMessage('');
      const response = await experticketService.getTransactionDocuments(transactionId);
      setDocuments(response.Documents || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch documents';
      setErrorMessage(message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [experticketService]);

  return {
    documents,
    loading,
    errorMessage,
    fetchDocuments
  };
};
