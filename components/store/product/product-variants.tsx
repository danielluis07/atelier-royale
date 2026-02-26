"use client";

export const ProductVariants = ({
  hasSizes,
  selectedVariantId,
  selectedVariant,
  activeStock,
  isOutOfStock,
  data,
  setSelectedVariantId,
  setQuantity,
}: {
  hasSizes: boolean;
  selectedVariantId: string | null;
  selectedVariant: {
    id: string;
    sku: string;
    name: string;
    size: string | null;
    priceOverride: number | null;
    stockQuantity: number;
    weightGrams: number | null;
    heightCm: number | null;
    widthCm: number | null;
    lengthCm: number | null;
  } | null;
  data: {
    variants: {
      id: string;
      sku: string;
      name: string;
      size: string | null;
      priceOverride: number | null;
      stockQuantity: number;
      weightGrams: number | null;
      heightCm: number | null;
      widthCm: number | null;
      lengthCm: number | null;
    }[];
    id: string;
    name: string;
    description: string;
    brand: string;
    imageUrl: string;
    basePrice: number;
    categoryId: string | null;
  };
  activeStock: number | null;
  isOutOfStock: boolean;
  setSelectedVariantId: (id: string | null) => void;
  setQuantity: (quantity: number) => void;
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs tracking-[0.2em] uppercase font-sans text-foreground">
          {hasSizes ? "Tamanho" : "Variação"}
        </span>
        {selectedVariant && activeStock !== null && (
          <span
            className={`text-[10px] tracking-[0.15em] uppercase font-sans ${
              isOutOfStock
                ? "text-destructive"
                : activeStock <= 3
                  ? "text-primary"
                  : "text-muted-foreground"
            }`}>
            {isOutOfStock
              ? "Esgotado"
              : activeStock <= 3
                ? `Últimas ${activeStock} unidades`
                : "Em estoque"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {data.variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isVarOutOfStock = variant.stockQuantity === 0;
          const label = hasSizes
            ? (variant.size ?? variant.name)
            : variant.name;

          return (
            <button
              key={variant.id}
              onClick={() => {
                setSelectedVariantId(isSelected ? null : variant.id);
                setQuantity(1);
              }}
              disabled={isVarOutOfStock}
              className={`
                        relative min-w-14 px-4 py-3 text-xs tracking-[0.15em] uppercase font-sans
                        border transition-all duration-300
                        ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : isVarOutOfStock
                              ? "border-border text-muted-foreground/40 cursor-not-allowed"
                              : "border-border text-foreground hover:border-foreground"
                        }
                      `}>
              {label}
              {isVarOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-px bg-muted-foreground/30 rotate-[-20deg]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
