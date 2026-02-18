
import React, { useState } from 'react';
import { ExperticketConfig } from '../types';
import { Save, ShieldCheck, AlertCircle, Globe, Key, Building2 } from 'lucide-react';

interface SettingsProps {
  config: ExperticketConfig;
  onUpdate: (config: ExperticketConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => {
      onUpdate(localConfig);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Configuration</h2>
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition shadow-lg ${
            status === 'saved' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'saving' ? (
            <span className="animate-pulse">Saving...</span>
          ) : status === 'saved' ? (
            <>
              <ShieldCheck size={20} />
              <span>Configuration Saved</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-blue-600 mb-2">
            <Building2 size={24} />
            <h3 className="text-lg font-bold text-gray-900">Partner Identity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Partner ID</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={localConfig.partnerId}
                onChange={(e) => setLocalConfig({ ...localConfig, partnerId: e.target.value })}
                placeholder="e.g. PARTNER_123"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">API Secret Key</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition pr-10"
                  value={localConfig.apiKey}
                  onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                  placeholder="Paste your API key here"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-blue-600 mb-2">
            <Globe size={24} />
            <h3 className="text-lg font-bold text-gray-900">Environment</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Base URL</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={localConfig.baseUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100 mt-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-orange-500" />
                <div>
                  <p className="text-sm font-bold text-orange-800">Sandbox / Test Mode</p>
                  <p className="text-xs text-orange-600">Transactions will not be actual bookings</p>
                </div>
              </div>
              <button
                onClick={() => setLocalConfig({ ...localConfig, isTest: !localConfig.isTest })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${localConfig.isTest ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${localConfig.isTest ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
