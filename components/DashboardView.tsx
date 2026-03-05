
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardMetrics from './dashboard/DashboardMetrics';

/**
 * The main dashboard view providing a high-level overview of sales activities.
 *
 * @remarks
 * This view displays key performance metrics and a call to action to start a new sale.
 *
 * @example
 * ```tsx
 * <DashboardView />
 * ```
 */
const DashboardView: React.FC = () => (
  <div className="space-y-6">
    <DashboardMetrics />

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

export default DashboardView;
