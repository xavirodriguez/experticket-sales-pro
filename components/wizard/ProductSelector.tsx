
import React from 'react';
import { Product } from '../../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  isDisabled: boolean;
  onProductChange: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  isDisabled,
  onProductChange
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700">Select Product</label>
    <select
      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50"
      disabled={isDisabled}
      value={selectedProductId}
      onChange={(e) => onProductChange(e.target.value)}
    >
      <option value="">Choose a product...</option>
      {products.map((product) => (
        <option key={product.Id} value={product.Id}>{product.Name}</option>
      ))}
    </select>
  </div>
);

export default ProductSelector;
