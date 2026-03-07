
import { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, TransactionDocument } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Retrieves and manages document links for a specific transaction.
 *
 * @param config - The Experticket API configuration.
 * @returns An object containing the document list, loading/error states, and a fetch function.
 *
 * @example
 * ```tsx
 * const { documents, fetchDocuments, loading } = useDocuments(config);
 * ```
 */
export const useDocuments = (config: ExperticketConfig) => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<TransactionDocument[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Fetches document links (e.g., tickets) for the given transaction identifier.
   * @internal
   * @param transactionId - The unique identifier of the transaction.
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
