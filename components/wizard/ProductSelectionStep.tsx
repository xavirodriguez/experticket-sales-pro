
import React, { useCallback } from 'react';
import { Provider, Product, SaleWizardState } from '../../types';
import ProviderSelector from './ProviderSelector';
import ProductSelector from './ProductSelector';
import BookingDetails from './BookingDetails';

/**
 * Props for the {@link ProductSelectionStep} component.
 * @internal
 */
interface ProductSelectionStepProps {
  /** Available ticket providers. */
  providers: Provider[];
  /** Products available for the selected provider. */
  products: Product[];
  /** The currently selected provider ID. */
  selectedProviderId: string;
  /** The currently selected product ID. */
  selectedProductId: string;
  /** The selected access date. */
  accessDate: string;
  /** The number of tickets requested. */
  quantity: number;
  /** Callback to update the wizard state. */
  onUpdate: (updates: Partial<SaleWizardState>) => void;
}

/**
 * First step of the wizard where users select provider, product, and booking details.
 *
 * @param props - Component props.
 * @internal
 */
const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  providers,
  products,
  selectedProviderId,
  selectedProductId,
  accessDate,
  quantity,
  onUpdate
}) => {
  const handleProviderChange = useCallback((providerId: string) => {
    onUpdate({ selectedProviderId: providerId, selectedProductId: '' });
  }, [onUpdate]);

  const handleProductChange = useCallback((productId: string) => {
    onUpdate({ selectedProductId: productId });
  }, [onUpdate]);

  const handleBookingUpdate = useCallback((updates: { accessDate?: string; quantity?: number }) => {
    onUpdate(updates);
  }, [onUpdate]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProviderSelector
          providers={providers}
          selectedProviderId={selectedProviderId}
          onProviderChange={handleProviderChange}
        />
        <ProductSelector
          products={products}
          selectedProductId={selectedProductId}
          isDisabled={!selectedProviderId}
          onProductChange={handleProductChange}
        />
      </div>

      <BookingDetails
        accessDate={accessDate}
        quantity={quantity}
        onUpdate={handleBookingUpdate}
      />
    </div>
  );
};

export default ProductSelectionStep;
