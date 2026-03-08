import { RevenueByPeriod } from "@/components/admin/stats/charts/revenue-by-period";
import { ProductsByStatus } from "@/components/admin/stats/charts/products-by-status";
import { requireAdmin } from "@/lib/auth-utils";
import { Suspense } from "react";
import { StatsOverview } from "@/components/admin/stats/stats-overview";
import { StatsOverviewSkeleton } from "@/components/skeletons/admin/stats-overview-skeleton";

const AdminPage = async () => {
  await requireAdmin();

  return (
    <>
      <Suspense fallback={<StatsOverviewSkeleton />}>
        <StatsOverview />
      </Suspense>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueByPeriod />
        </div>
        <ProductsByStatus />
      </div>
    </>
  );
};

export default AdminPage;
