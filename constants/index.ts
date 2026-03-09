export const TIME_ZONE = "America/Sao_Paulo";

// General
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
};

export const STORE_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 12,
};

export const MAX_FILE_SIZE_BYTES = {
  label: "3MB",
  value: 3 * 1024 * 1024,
} as const;

export const SORT_ORDER_OPTIONS = [
  { label: "Mais recentes", value: "desc" },
  { label: "Mais antigos", value: "asc" },
] as const;

export const STORE_SORT_BY_OPTIONS = [
  { label: "Data", value: "createdAt" },
  { label: "Nome", value: "name" },
  { label: "Preço", value: "price" },
] as const;

// Users
export const USER_STATUS_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Banido", value: "true" },
  { label: "Ativo", value: "false" },
] as const;

export const USER_SORT_BY_OPTIONS = [
  { label: "Data de criação", value: "createdAt" },
  { label: "Data de atualização", value: "updatedAt" },
] as const;

// Products
export const PRODUCT_STATUS_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Disponível", value: "true" },
  { label: "Indisponível", value: "false" },
] as const;

export const PRODUCT_SORT_BY_OPTIONS = [
  { label: "Data de criação", value: "createdAt" },
  { label: "Data de atualização", value: "updatedAt" },
  { label: "Nome", value: "name" },
  { label: "Preço", value: "price" },
] as const;

// Orders
export const ORDER_STATUS_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Aguardando pagamento", value: "pending_payment" },
  { label: "Pago", value: "paid" },
  { label: "Em preparação", value: "processing" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregue", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Reembolsado", value: "refunded" },
] as const;

export const DELIVERY_STATUS_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Em separação", value: "processing" },
  { label: "Despachado", value: "dispatched" },
  { label: "Em trânsito", value: "in_transit" },
  { label: "Entregue", value: "delivered" },
  { label: "Falha na entrega", value: "failed" },
] as const;

export const ORDER_SORT_BY_OPTIONS = [
  { label: "Data de criação", value: "createdAt" },
  { label: "Total do pedido", value: "totalAmount" },
  { label: "Número do pedido", value: "orderNumber" },
] as const;

export const ORDER_STATUS_LABELS = {
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  processing: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
} as const;

export const DELIVERY_STATUS_LABELS = {
  processing: "Em separação",
  dispatched: "Despachado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  failed: "Falha na entrega",
} as const;

export const MAX_FEATURED_PRODUCTS = 4;

export const MAX_NEW_PRODUCTS = 10;

export const MAX_BEST_SELLERS = 4;

export const MAX_RELATED_PRODUCTS = 4;

export const NEW_PRODUCT_THRESHOLD_DAYS = 30;

export const FREE_SHIPPING_THRESHOLD = 50000;

export const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
