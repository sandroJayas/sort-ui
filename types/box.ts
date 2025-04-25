export type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  image_url: string;
};

export type BoxStatus =
  | "in_transit"
  | "pending_pack"
  | "pending_pickup"
  | "stored"
  | "returned"
  | "disposed";

export type Box = {
  id: string;
  packing_mode: string;
  status: BoxStatus;
  items: Item[];
  created_at: string;
  updated_at: string;
  pickup_address: {
    street: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
  };
};
