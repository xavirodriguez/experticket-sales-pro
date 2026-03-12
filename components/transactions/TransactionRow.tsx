
import React from 'react';
import { Transaction } from '../../types';
import TransactionIdCell from './cells/TransactionIdCell';
import DateCell from './cells/DateCell';
import ProductCell from './cells/ProductCell';
import AmountCell from './cells/AmountCell';
import StatusCell from './cells/StatusCell';
import ActionCell from './cells/ActionCell';

/**
 * Props for the {@link TransactionRow} component.
 * @internal
 */
interface TransactionRowProps {
  /** The transaction data to display in this row. */
  transaction: Transaction;
}

/**
 * Renders an individual row in the transaction table.
 *
 * @param props - Component props containing transaction data.
 * @internal
 */
const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const firstProduct = transaction.Products?.[0];
  const amount = transaction.TotalRetailPrice || transaction.TotalPrice || 0;

  return (
    <tr className="hover:bg-gray-50/50 transition cursor-default">
      <TransactionIdCell id={transaction.TransactionId} timestamp={transaction.TransactionDateTime} />
      <DateCell date={transaction.AccessDateTime} />
      <ProductCell
        productName={firstProduct?.ProductName || 'Mixed Items'}
        providerName={firstProduct?.ProviderName || ''}
      />
      <AmountCell amount={amount} />
      <StatusCell success={transaction.Success} />
      <ActionCell />
    </tr>
  );
};

export default TransactionRow;
