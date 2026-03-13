
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Hook for fetching and managing dashboard metrics.
 *
 * @param config - The Experticket API configuration.
 * @returns Object containing metric values and loading state.
 */
export const useDashboardMetrics = (config: ExperticketConfig) => {
  const [loading, setLoading] = useState(true);
  const [transactionCount, setTransactionCount] = useState('--');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  const fetchMetrics = useCallback(async () => {
    if (!config.apiKey || !config.baseUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await experticketService.getTransactions({ PageSize: 50 });
      const count = response.Transactions?.length || 0;
      setTransactionCount(count.toString());
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      setTransactionCount('--');
    } finally {
      setLoading(false);
    }
  }, [experticketService, config.apiKey, config.baseUrl]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    reservations: '--', // TODO: Implement when endpoint is available
    transactions: transactionCount,
    catalogItems: '--', // TODO: Implement when endpoint is available
    loading
  };
};
