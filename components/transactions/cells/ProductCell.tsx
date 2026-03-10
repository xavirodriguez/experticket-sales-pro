
import React from 'react';

interface ProductCellProps {
  productName: string;
  providerName: string;
}

/**
 * Renders the product name and provider information.
 *
 * @param props - Component props.
 * @internal
 */
const ProductCell: React.FC<ProductCellProps> = ({ productName, providerName }) => (
  <td className="px-6 py-4">
    <span className="text-sm font-semibold text-gray-800">{productName}</span>
    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{providerName}</p>
  </td>
);

export default ProductCell;
