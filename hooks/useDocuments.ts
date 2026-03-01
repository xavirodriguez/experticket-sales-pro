
import { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, TransactionDocument } from '../types';
import ExperticketService from '../services/experticketService';

export const useDocuments = (config: ExperticketConfig) => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<TransactionDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchDocuments = useCallback(async (id: string) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await service.getTransactionDocuments(id);
      setDocuments(res.Documents || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(message);
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
