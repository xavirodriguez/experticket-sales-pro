
import React from 'react';
import { Provider } from '../../types';

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProviderId: string;
  onProviderChange: (providerId: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProviderId,
  onProviderChange
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700">Select Provider</label>
    <select
      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
      value={selectedProviderId}
      onChange={(e) => onProviderChange(e.target.value)}
    >
      <option value="">Choose a provider...</option>
      {providers.map(provider => (
        <option key={provider.Id} value={provider.Id}>{provider.Name}</option>
      ))}
    </select>
  </div>
);

export default ProviderSelector;
