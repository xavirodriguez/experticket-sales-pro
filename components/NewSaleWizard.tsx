
import React, { useState, useEffect, useMemo } from 'react';
import { ExperticketConfig, Product } from '../types';
import ExperticketService from '../services/experticketService';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Calendar,
  Ticket,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface WizardState {
  step: number;
  selectedProviderId: string;
  selectedProductId: string;
  accessDate: string;
  quantity: number;
  reservationId: string;
  transactionId: string;
  reservationExpiry: number;
}

const STEPS = [
  { id: 1, name: 'Product', icon: Ticket },
  { id: 2, name: 'Capacity & Price', icon: Calendar },
  { id: 3, name: 'Reservation', icon: UserCheck },
  { id: 4, name: 'Confirmation', icon: CreditCard },
];

const NewSaleWizard: React.FC<{ config: ExperticketConfig }> = ({ config }) => {
  const [state, setState] = useState<WizardState>({
    step: 1,
    selectedProviderId: '',
    selectedProductId: '',
    accessDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    reservationId: '',
    transactionId: '',
    reservationExpiry: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any>(null);
  const [capacityInfo, setCapacityInfo] = useState<any>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [provRes, catRes] = await Promise.all([
          service.getProviders(),
          service.getCatalog()
        ]);
        setProviders(provRes.Providers || []);
        setCatalog(catRes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [service]);

  const handleNext = async () => {
    setError(null);
    if (state.step === 1) {
      if (!state.selectedProductId) return setError('Please select a product');
      setState(s => ({ ...s, step: 2 }));
      checkCapacity();
    } else if (state.step === 2) {
      createReservation();
    } else if (state.step === 3) {
      completeTransaction();
    }
  };

  const checkCapacity = async () => {
    try {
      setLoading(true);
      const res = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
      setCapacityInfo(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async () => {
    try {
      setLoading(true);
      const res = await service.createReservation({
        AccessDateTime: state.accessDate,
        Products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
      });
      if (res.Success) {
        setState(s => ({ 
          ...s, 
          step: 3, 
          reservationId: res.ReservationId, 
          reservationExpiry: res.MinutesToExpiry 
        }));
      } else {
        setError(res.ErrorMessage || 'Reservation failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeTransaction = async () => {
    try {
      setLoading(true);
      const res = await service.createTransaction(
        state.reservationId, 
        state.accessDate, 
        [{ ProductId: state.selectedProductId }]
      );
      // Handle non-standard responses from common Ticket APIs
      setState(s => ({ ...s, step: 4 }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!catalog?.ProductBases) return [];
    return catalog.ProductBases
      .flatMap((pb: any) => pb.Products || [])
      .filter((p: any) => p.ProviderId === state.selectedProviderId);
  }, [catalog, state.selectedProviderId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Wizard Header / Steps */}
      <div className="border-b border-gray-100 bg-gray-50/50 p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = state.step > step.id;
            const isActive = state.step === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border-2 border-gray-200'}
                  `}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4 -mt-6" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 min-h-[400px]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {state.step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Select Provider</label>
                <select 
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={state.selectedProviderId}
                  onChange={(e) => setState(s => ({ ...s, selectedProviderId: e.target.value, selectedProductId: '' }))}
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
                  disabled={!state.selectedProviderId}
                  value={state.selectedProductId}
                  onChange={(e) => setState(s => ({ ...s, selectedProductId: e.target.value }))}
                >
                  <option value="">Choose a product...</option>
                  {filteredProducts.map((p: any) => (
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
                  value={state.accessDate}
                  onChange={(e) => setState(s => ({ ...s, accessDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={state.quantity}
                  onChange={(e) => setState(s => ({ ...s, quantity: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        )}

        {state.step === 2 && capacityInfo && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">Availability Status</h3>
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-medium">
                  Available Capacity: {capacityInfo.Products?.[0]?.AvailableCapacity ?? 'Infinite'}
                </span>
              </div>
              <div className="mt-4 text-2xl font-bold text-blue-900">
                Price: €{capacityInfo.Products?.[0]?.Price ?? '--'}
              </div>
            </div>
          </div>
        )}

        {state.step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-green-800">Reservation Successful!</h3>
              <p className="text-green-700 mt-1">ID: <code className="font-bold">{state.reservationId}</code></p>
              <div className="mt-4 inline-block px-4 py-1 bg-green-600 text-white rounded-full text-xs font-bold animate-pulse">
                Expires in {state.reservationExpiry} minutes
              </div>
            </div>
          </div>
        )}

        {state.step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold">Sale Completed</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              The transaction has been successfully processed. Access codes and documents are now available in the dashboard.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button 
                onClick={() => window.location.hash = '/transactions'}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold transition"
              >
                View Transaction
              </button>
              <button 
                onClick={() => setState({ ...state, step: 1, reservationId: '', transactionId: '' })}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-100"
              >
                New Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Controls */}
      {state.step < 4 && (
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <button 
            disabled={state.step === 1 || loading}
            onClick={() => setState(s => ({ ...s, step: s.step - 1 }))}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30 transition font-bold"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <button 
            disabled={loading}
            onClick={handleNext}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>{state.step === 3 ? 'Complete Sale' : 'Continue'}</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSaleWizard;
