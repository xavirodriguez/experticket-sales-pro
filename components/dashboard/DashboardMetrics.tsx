
import React from 'react';
import { ShoppingBag, History, FileText } from 'lucide-react';
import DashboardCard from './DashboardCard';

/**
 * Displays a grid of key performance metrics for the dashboard.
 *
 * @example
 * ```tsx
 * <DashboardMetrics />
 * ```
 */
const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        icon={ShoppingBag}
        title="Active Reservations"
        value="24"
        trend="+12% vs last week"
        color="blue"
      />
      <DashboardCard
        icon={History}
        title="Daily Transactions"
        value="142"
        trend="+5% vs last week"
        color="green"
      />
      <DashboardCard
        icon={FileText}
        title="Catalog Items"
        value="1,204"
        trend="Stable"
        color="purple"
      />
    </div>
  );
};

export default DashboardMetrics;
