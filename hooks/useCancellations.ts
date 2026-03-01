
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, CancellationRequest } from '../types';
import ExperticketService from '../services/experticketService';

export const useCancellations = (config: ExperticketConfig) => {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchRequests = useCallback(async () => {
    if (!config.apiKey) return;

    try {
      setLoading(true);
      const res = await service.getCancellationRequests({ PageSize: 20 });
      setRequests(res.CancellationRequests || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cancellation requests';
      console.error(message, err);
    } finally {
      setLoading(false);
    }
  }, [service, config.apiKey]);

  const submitCancellation = useCallback(async (saleId: string, reason: number, comments: string) => {
    try {
      setIsSubmitting(true);
      await service.submitCancellation({ saleId, reason, comments });
      await fetchRequests();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [service, fetchRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    isSubmitting,
    submitCancellation,
    refresh: fetchRequests
  };
};
