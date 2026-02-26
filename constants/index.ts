// General
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
};

export const MAX_FILE_SIZE_BYTES = {
  label: "3MB",
  value: 3 * 1024 * 1024,
} as const;

export const SORT_ORDER_OPTIONS = [
  { label: "Mais recentes", value: "desc" },
  { label: "Mais antigos", value: "asc" },
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

export const MAX_FEATURED_PRODUCTS = 4;

export const MAX_NEW_PRODUCTS = 10;

export const MAX_BEST_SELLERS = 4;

export const NEW_PRODUCT_THRESHOLD_DAYS = 30;
