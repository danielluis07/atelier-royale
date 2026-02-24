// General
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
};

export const MAX_FILE_SIZE_BYTES = {
  label: "5MB",
  value: 5 * 1024 * 1024,
};

export const SORT_ORDER_OPTIONS = [
  { label: "Mais recentes", value: "desc" },
  { label: "Mais antigos", value: "asc" },
] as const;

// Users
export const USER_STATUS_OPTIONS = [
  { label: "Todos", value: "all" }, // or value: ""
  { label: "Banido", value: "true" },
  { label: "Ativo", value: "false" },
] as const;

export const USER_SORT_BY_OPTIONS = [
  { label: "Data de criação", value: "createdAt" },
  { label: "Data de atualização", value: "updatedAt" },
] as const;
