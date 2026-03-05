
import { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, TransactionDocument } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Hook for retrieving document links for a specific transaction.
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
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Fetches document links (e.g., tickets) for the given transaction identifier.
   *
   * @param transactionId - The unique identifier of the transaction.
   */
  const fetchDocuments = useCallback(async (transactionId: string) => {
    if (!transactionId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await service.getTransactionDocuments(transactionId);
      setDocuments(response.Documents || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents';
      setError(errorMessage);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    documents,
    loading,
    error,
    fetchDocuments
  };
};
