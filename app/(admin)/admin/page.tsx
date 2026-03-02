import { StatsCard } from "@/components/admin/stats/stats-card";
import { RevenueByPeriod } from "@/components/admin/stats/charts/revenue-by-period";
import { ProductsByStatus } from "@/components/admin/stats/charts/products-by-status";
import { requireAdmin } from "@/lib/auth-utils";
import { centsToReais } from "@/lib/utils";
import {
  getFinancialMetrics,
  getTotalOrders,
  getTotalProducts,
} from "@/modules/stats/actions";
import { Shirt, Package, TrendingUp, DollarSign } from "lucide-react";

const AdminPage = async () => {
  await requireAdmin();

  const [totalProducts, totalOrders, financials] = await Promise.all([
    getTotalProducts(),
    getTotalOrders(),
    getFinancialMetrics(),
  ]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Produtos"
          value={totalProducts}
          icon={Shirt}
        />
        <StatsCard
          title="Total de Pedidos"
          value={totalOrders}
          icon={Package}
        />
        <StatsCard
          title="Ticket Médio"
          value={centsToReais(financials.averageTicket)}
          icon={TrendingUp}
        />
        <StatsCard
          title="Receita Total"
          value={centsToReais(financials.totalRevenue)}
          icon={DollarSign}
        />
      </div>

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
