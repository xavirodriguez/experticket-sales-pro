
import React from 'react';

/**
 * Visual color mapping for dashboard cards.
 * @internal
 */
const COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
};

/**
 * Text color mapping for dashboard card trends.
 * @internal
 */
const TEXT_COLORS: Record<string, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-gray-400',
};

/**
 * Props for the {@link DashboardCard} component.
 */
interface DashboardCardProps {
  /** The icon to display in the card. */
  icon: React.ElementType;
  /** The title of the metric. */
  title: string;
  /** The current value of the metric. */
  value: string;
  /** The trend text (e.g., "+5%"). */
  trend: string;
  /** Color theme key for the card. */
  color: 'blue' | 'green' | 'purple';
}

/**
 * A reusable card component for displaying dashboard metrics.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <DashboardCard
 *   icon={ShoppingBag}
 *   title="Active Reservations"
 *   value="24"
 *   trend="+12% vs last week"
 *   color="blue"
 * />
 * ```
 */
const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${COLOR_CLASSES[color]}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold ${TEXT_COLORS[color]}`}>
          {trend}
        </span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
};

export default DashboardCard;
