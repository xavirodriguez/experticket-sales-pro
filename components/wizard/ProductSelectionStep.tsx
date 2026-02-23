
import React from 'react';
import { Provider, Product, WizardState } from '../../types';

interface ProductSelectionStepProps {
  providers: Provider[];
  products: Product[];
  selectedProviderId: string;
  selectedProductId: string;
  accessDate: string;
  quantity: number;
  onUpdate: (updates: Partial<WizardState>) => void;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  providers,
  products,
  selectedProviderId,
  selectedProductId,
  accessDate,
  quantity,
  onUpdate
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Select Provider</label>
          <select
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={selectedProviderId}
            onChange={(e) => onUpdate({ selectedProviderId: e.target.value, selectedProductId: '' })}
          >
            <option value="">Choose a provider...</option>
            {providers.map(p => (
              <option key={p.Id} value={p.Id}>{p.Name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Select Product</label>
          <select
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50"
            disabled={!selectedProviderId}
            value={selectedProductId}
            onChange={(e) => onUpdate({ selectedProductId: e.target.value })}
          >
            <option value="">Choose a product...</option>
            {products.map((p) => (
              <option key={p.Id} value={p.Id}>{p.Name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Access Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={accessDate}
            onChange={(e) => onUpdate({ accessDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Quantity</label>
          <input
            type="number"
            min="1"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={quantity}
            onChange={(e) => onUpdate({ quantity: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionStep;
