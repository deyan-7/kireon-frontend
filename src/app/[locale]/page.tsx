"use client";

import Protected from "@/components/Protected";
import Dashboard from "@/components/Dashboard";

const DashboardPage: React.FC = () => {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
};

export default DashboardPage;
