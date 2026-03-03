
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Transaction } from '../types';
import ExperticketService from '../services/experticketService';

export const useTransactions = (config: ExperticketConfig) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchTransactions = useCallback(async () => {
    if (!config.apiKey) return;

    try {
      setLoading(true);
      const response = await service.getTransactions({ PageSize: 50 });
      setTransactions(response.Transactions || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      console.error(errorMessage, error);
    } finally {
      setLoading(false);
    }
  }, [service, config.apiKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
