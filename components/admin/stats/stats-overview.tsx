import { StatsCard } from "@/components/admin/stats/stats-card";
import { centsToReais } from "@/lib/utils";
import {
  getFinancialMetrics,
  getTotalOrders,
  getTotalProducts,
} from "@/modules/stats/actions";
import { Shirt, Package, TrendingUp, DollarSign } from "lucide-react";

export const StatsOverview = async () => {
  const [totalProducts, totalOrders, financials] = await Promise.all([
    getTotalProducts(),
    getTotalOrders(),
    getFinancialMetrics(),
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard title="Total de Produtos" value={totalProducts} icon={Shirt} />
      <StatsCard title="Total de Pedidos" value={totalOrders} icon={Package} />
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
  );
};
