const STATUS_STEPS = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

const STATUS_STEP_LABELS: Record<string, string> = {
  pending_payment: "Pagamento",
  paid: "Confirmado",
  processing: "Preparação",
  shipped: "Enviado",
  delivered: "Entregue",
};

export const OrderStatusTimeline = ({ status }: { status: string }) => {
  const isCancelledOrRefunded = status === "cancelled" || status === "refunded";

  if (isCancelledOrRefunded) {
    return null;
  }

  const currentStepIndex = STATUS_STEPS.indexOf(
    status as (typeof STATUS_STEPS)[number],
  );

  if (currentStepIndex < 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-border" />
        <div
          className="absolute top-4 left-0 h-px bg-primary transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />

        {STATUS_STEPS.map((step, i) => {
          const isActive = i <= currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <div
              key={step}
              className="relative flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 flex items-center justify-center border transition-colors ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                } ${isCurrent ? "ring-2 ring-primary/20" : ""}`}>
                <span className="text-[10px] font-sans font-medium">
                  {i + 1}
                </span>
              </div>
              <span
                className={`mt-2 text-[10px] tracking-widest uppercase font-sans ${
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                }`}>
                {STATUS_STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sm:hidden flex flex-col gap-0">
        {STATUS_STEPS.map((step, i) => {
          const isActive = i <= currentStepIndex;
          const isLast = i === STATUS_STEPS.length - 1;
          const isCurrent = i === currentStepIndex;
          return (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-primary/20" : ""}`}>
                  <span className="text-[9px] font-sans font-medium">
                    {i + 1}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`w-px h-6 ${isActive ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-sans pt-0.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                }`}>
                {STATUS_STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
