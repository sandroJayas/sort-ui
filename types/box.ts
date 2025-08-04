// types/box.ts

// ==================== BOX TYPES ====================

import { UUID } from "node:crypto";
import { ISODateString } from "next-auth";
import { Address } from "@/types/order";

export interface Dimensions {
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
}

export interface LocationInfo {
  id: UUID;
  name: string;
  address: string;
}

export interface OperationInfo {
  id: UUID;
  operation_type: string;
  status: string;
  scheduled_date?: ISODateString;
  completed_date?: ISODateString;
}

export interface BoxResponse {
  id: UUID;
  order_id: UUID;
  user_id: UUID;
  status: BoxStatus;
  name?: string;
  description?: string;
  dimensions?: Dimensions; // User-provided
  verified_dimensions?: Dimensions; // Admin-verified
  weight?: number; // in kg
  location?: LocationInfo;
  operations?: OperationInfo[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface BoxListResponse {
  id: UUID;
  order_id: UUID;
  status: BoxStatus;
  name?: string;
  location?: string;
  is_stored: boolean;
  created_at: ISODateString;
}

// ==================== REQUEST TYPES ====================

export interface UpdateBoxRequest {
  name?: string;
  description?: string;
  dimensions?: Dimensions;
}

export interface AdminUpdateBoxRequest {
  status?: BoxStatus;
  verified_dimensions?: Dimensions;
  weight?: number;
  location_id?: UUID;
}

export interface RequestBoxReturnRequest {
  box_ids: UUID[];
  delivery_address: Address;
  notes?: string;
}

// ==================== RESPONSE TYPES ====================

export interface BoxesListResponse {
  boxes: BoxListResponse[];
}

export interface BatchIDResponse {
  ids: UUID[];
}

// ==================== ENUMS ====================

export enum BoxStatus {
  IN_TRANSIT = "in_transit",
  PENDING_PACK = "pending_pack",
  PENDING_PICKUP = "pending_pickup",
  AWAITING_INTAKE = "awaiting_intake",
  STORED = "stored",
  RETURNED = "returned",
  DISPOSED = "disposed",
}

// ==================== FILTER TYPES ====================

export interface BoxFilterRequest {
  status?: string;
  location_id?: string;
  stored_only?: boolean;
}
