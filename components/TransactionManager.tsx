
import React from 'react';
import { ExperticketConfig } from '../types';
import { useTransactions } from '../hooks/useTransactions';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionTable from './transactions/TransactionTable';

/**
 * Props for the {@link TransactionManager} component.
 */
interface TransactionManagerProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * Orchestrates the display and filtering of transaction history.
 *
 * @remarks
 * This component coordinates between search filters and the transaction data
 * table. It utilizes the {@link useTransactions} hook to fetch and filter
 * the sales data.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <TransactionManager config={myConfig} />
 * ```
 */
const TransactionManager: React.FC<TransactionManagerProps> = ({ config }) => {
  const {
    transactions,
    loading,
    searchTerm,
    setSearchTerm,
    refresh
  } = useTransactions(config);

  return (
    <div className="space-y-6">
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refresh}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <TransactionTable
          transactions={transactions}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TransactionManager;
