
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
      const res = await service.getTransactions({ PageSize: 50 });
      setTransactions(res.Transactions || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      console.error(message, err);
    } finally {
      setLoading(false);
    }
  }, [service, config.apiKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return transactions.filter(t =>
      t.TransactionId.toLowerCase().includes(term) ||
      t.Products?.some(p => p.ProductName?.toLowerCase().includes(term))
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
