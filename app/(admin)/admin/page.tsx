import { requireAdmin } from "@/lib/auth-utils";
import { Suspense } from "react";
import { StatsOverview } from "@/components/admin/stats/stats-overview";
import { StatsOverviewSkeleton } from "@/components/skeletons/admin/stats-overview-skeleton";
import { SalesEvolutionChart } from "@/components/admin/stats/charts/sales-evolution-chart";

const AdminPage = async () => {
  await requireAdmin();

  return (
    <>
      <Suspense fallback={<StatsOverviewSkeleton />}>
        <StatsOverview />
      </Suspense>
      <div className="mt-10">
        <SalesEvolutionChart />
      </div>
    </>
  );
};

export default AdminPage;
