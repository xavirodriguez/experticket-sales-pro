
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, History, FileText } from 'lucide-react';
import { ExperticketConfig } from '../types';

const DashboardView: React.FC<{ config: ExperticketConfig }> = ({ config }) => (
  <div className="space-y-6">
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

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome back, Sales Agent</h2>
        <p className="text-gray-600 mb-6">
          Ready to process new bookings? Use the <span className="font-semibold text-blue-600">New Sale Wizard</span> to guide you through capacity checks, pricing, and reservation.
        </p>
        <Link
          to="/new-sale"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Start New Sale
        </Link>
      </div>
    </div>
  </div>
);

const DashboardCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  trend: string;
  color: string;
}> = ({ icon: Icon, title, value, trend, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold ${color === 'purple' ? 'text-gray-400' : colorClasses[color].split(' ')[1]}`}>
          {trend}
        </span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
};

export default DashboardView;
