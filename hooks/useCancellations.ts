
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, CancellationRequest } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Hook for managing cancellation requests.
 *
 * @param config - The Experticket API configuration.
 * @returns An object containing the list of requests, loading states, and a function to submit new cancellations.
 *
 * @example
 * ```tsx
 * const { requests, submitCancellation, loading } = useCancellations(config);
 * ```
 */
export const useCancellations = (config: ExperticketConfig) => {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Fetches the latest cancellation requests from the API.
   */
  const fetchRequests = useCallback(async () => {
    if (!config.apiKey) return;

    try {
      setLoading(true);
      const response = await service.getCancellationRequests({ PageSize: 20 });
      setRequests(response.CancellationRequests || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cancellation requests';
      console.error(errorMessage, error);
    } finally {
      setLoading(false);
    }
  }, [service, config.apiKey]);

  /**
   * Submits a new cancellation request for a specific sale.
   *
   * @param saleId - The identifier of the sale to cancel.
   * @param reason - The numeric reason code for cancellation.
   * @param comments - Optional explanatory comments.
   * @throws Error if the cancellation submission fails.
   */
  const submitCancellation = useCallback(async (saleId: string, reason: number, comments: string) => {
    try {
      setIsSubmitting(true);
      await service.submitCancellation({ saleId, reason, comments });
      await fetchRequests();
    } catch (error: unknown) {
      throw error;
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
