export type MpWebhookBody = {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number | string;
  live_mode: boolean;
  type: "payment" | "order" | "merchant_order";
  user_id: string | number;
};
