
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Transaction } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Fetches and filters sales transactions for the dashboard.
 *
 * @param config - The Experticket API configuration.
 * @returns An object containing the transaction list, loading state, search functionality, and refresh function.
 *
 * @example
 * ```tsx
 * const { transactions, searchTerm, setSearchTerm, refresh } = useTransactions(config);
 * ```
 */
export const useTransactions = (config: ExperticketConfig) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Fetches the latest transactions from the API.
   * @internal
   */
  const fetchTransactions = useCallback(async () => {
    if (!config.apiKey) return;

    try {
      setLoading(true);
      const response = await experticketService.getTransactions({ PageSize: 50 });
      setTransactions(response.Transactions || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      console.error(errorMessage, error);
    } finally {
      setLoading(false);
    }
  }, [experticketService, config.apiKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Memoized list of transactions filtered by the search term.
   * @internal
   */
  const filteredTransactions = useMemo(() => {
    const searchToken = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.TransactionId.toLowerCase().includes(searchToken) ||
      transaction.Products?.some(product => product.ProductName?.toLowerCase().includes(searchToken))
    );
  }, [transactions, searchTerm]);

  return {
    transactions: filteredTransactions,
    loading,
    searchTerm,
    setSearchTerm,
    refresh: fetchTransactions
  };
};
