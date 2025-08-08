// types/subscription.ts

export interface CreateCheckoutSessionRequest {
  price_id?: string; // Optional, defaults to config value
}

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
  expires_at: string;
}

export interface BillingPortalSessionResponse {
  portal_url: string;
  return_url: string;
}

export interface PlanDetails {
  name: string;
  amount: number; // Amount in cents
  currency: string;
  interval: string; // month, year, etc.
}

export interface UserSubscriptionResponse {
  id: string;
  user_id: string;
  status: string;
  price_id?: string;
  product_id?: string;
  current_period_end: string;
  current_period_start: string;
  cancel_at_period_end: boolean;
  plan_details?: PlanDetails;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatusResponse {
  has_active_subscription: boolean;
  subscription?: UserSubscriptionResponse;
}

export interface CheckoutVerificationResponse {
  success: boolean;
  subscription_active: boolean;
  subscription?: UserSubscriptionResponse;
  message: string;
}

export interface CreateBillingPortalRequest {
  return_url?: string; // Optional, defaults to /account
}

export interface BillingPortalResponse {
  url: string;
}

export interface SuccessResponse {
  message: string;
}
