
import React from 'react';
import { ShoppingBag, History, FileText } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { ExperticketConfig } from '../../types';

/**
 * Props for the {@link DashboardMetrics} component.
 */
interface DashboardMetricsProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * Displays a grid of key performance metrics for the dashboard.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <DashboardMetrics config={config} />
 * ```
 */
const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ config }) => {
  const { reservations, transactions, catalogItems } = useDashboardMetrics(config);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        icon={ShoppingBag}
        title="Active Reservations"
        value={reservations}
        trend="+12% vs last week"
        color="blue"
      />
      <DashboardCard
        icon={History}
        title="Daily Transactions"
        value={transactions}
        trend="+5% vs last week"
        color="green"
      />
      <DashboardCard
        icon={FileText}
        title="Catalog Items"
        value={catalogItems}
        trend="Stable"
        color="purple"
      />
    </div>
  );
};

export default DashboardMetrics;
