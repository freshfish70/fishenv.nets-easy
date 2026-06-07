import { Order } from "./common.ts";
import { Notifications } from "./payment.ts";

// ---------------------------------------------------------------------------
// Retrieve subscription — GET /v1/subscriptions/{subscriptionId}
//                         GET /v1/subscriptions?externalReference={ref}
// ---------------------------------------------------------------------------

/**
 * Subscription details returned by GET /v1/subscriptions/{subscriptionId}
 * and GET /v1/subscriptions?externalReference={ref}.
 */
export interface SubscriptionDetails {
  /** The subscription identifier (UUID). */
  subscriptionId: string;

  frequency?: number;

  /**
   * Minimum number of days between charges.
   * 0 means no interval restriction.
   */
  interval: number;

  /** ISO 8601 date-time when the subscription expires. */
  endDate: string;

  paymentDetails: {
    /** Possible values: "CARD", "INVOICE", "A2A", "INSTALLMENT", "WALLET", "PREPAID-INVOICE". */
    paymentType: string;
    /** For example "Visa" or "Mastercard". */
    paymentMethod: string;
    cardDetails: {
      /** Four-digit expiry date in MMYY format. */
      expiryDate: string;
      /** Masked PAN — at most first 6 and last 4 digits. */
      maskedPan: string;
    };
  };

  /** Present only for subscriptions imported from an external platform. */
  importError?: {
    importStepsResponseCode?: string;
    importStepsResponseSource?: string;
    importStepsResponseText?: string;
  };
}

// ---------------------------------------------------------------------------
// Charge subscription — POST /v1/subscriptions/{subscriptionId}/charges
// ---------------------------------------------------------------------------

/**
 * Request body for POST /v1/subscriptions/{subscriptionId}/charges (HTTP 200).
 */
export interface ChargeSubscriptionRequest {
  /**
   * The order to charge against this subscription. Required.
   */
  order: Order;

  /**
   * Webhook subscriptions for this charge operation.
   */
  notifications?: Notifications;

  /**
   * Merchant payment reference. Max 36 characters.
   */
  myReference?: string;
}

/**
 * Response from POST /v1/subscriptions/{subscriptionId}/charges (HTTP 200).
 */
export interface ChargeSubscriptionResponse {
  /** UUID of the new payment object created for this charge. */
  paymentId: string;
  /** UUID of the charge. */
  chargeId: string;
}

// ---------------------------------------------------------------------------
// Bulk charge subscriptions — POST /v1/subscriptions/charges
//                             GET  /v1/subscriptions/charges/{bulkId}
// ---------------------------------------------------------------------------

/**
 * A single subscription entry in a bulk charge request.
 * Provide either subscriptionId or externalReference, not both.
 */
export interface BulkChargeSubscriptionItem {
  /** UUID of the subscription (from Retrieve payment). */
  subscriptionId?: string;
  /** External reference for imported subscriptions. */
  externalReference?: string;
  /** The order to charge. Required per item. */
  order: Order;
  /** Merchant payment reference. Max 36 characters. */
  myReference?: string;
}

/**
 * Request body for POST /v1/subscriptions/charges (HTTP 202).
 */
export interface BulkChargeSubscriptionsRequest {
  /**
   * A unique string identifying this bulk charge operation (enables safe retries).
   * Must be 1–64 characters.
   */
  externalBulkChargeId: string;

  /**
   * Webhook subscriptions for bulk charge status updates.
   */
  notifications?: Notifications;

  /**
   * The subscriptions to charge.
   */
  subscriptions: BulkChargeSubscriptionItem[];
}

/**
 * Response from POST /v1/subscriptions/charges (HTTP 202).
 */
export interface BulkChargeSubscriptionsResponse {
  /** UUID of the bulk charge operation. Use to poll GET /v1/subscriptions/charges/{bulkId}. */
  bulkId: string;
}

/**
 * A single result entry from GET /v1/subscriptions/charges/{bulkId}.
 */
export interface BulkChargeResultItem {
  subscriptionId: string;
  paymentId?: string;
  chargeId?: string;
  /** Possible values: "Pending", "Succeeded", "Failed". */
  status: string;
  message?: string;
  code?: string;
  source?: string;
  externalReference?: string;
}

/**
 * Response from GET /v1/subscriptions/charges/{bulkId} (HTTP 200).
 */
export interface BulkChargesResponse {
  page?: BulkChargeResultItem[];
  /** True when there are more results beyond the requested page. */
  more?: boolean;
  /** Possible values: "Done", "Processing". */
  status?: string;
}

// ---------------------------------------------------------------------------
// Verify subscriptions — POST /v1/subscriptions/verifications
//                        GET  /v1/subscriptions/verifications/{bulkId}
// ---------------------------------------------------------------------------

/**
 * A single subscription entry in a bulk verification request.
 * Provide either subscriptionId or externalReference, not both.
 */
export interface BulkVerifySubscriptionItem {
  subscriptionId?: string;
  externalReference?: string;
}

/**
 * Request body for POST /v1/subscriptions/verifications (HTTP 202).
 */
export interface BulkVerifySubscriptionsRequest {
  /**
   * A unique string identifying this verification operation (enables safe retries).
   * Must be 1–64 characters.
   */
  externalBulkVerificationId?: string;

  /**
   * The subscriptions to verify.
   */
  subscriptions?: BulkVerifySubscriptionItem[];
}

/**
 * Response from POST /v1/subscriptions/verifications (HTTP 202).
 */
export interface BulkVerifySubscriptionsResponse {
  /** UUID of the bulk verification operation. */
  bulkId: string;
}

/**
 * A single result entry from GET /v1/subscriptions/verifications/{bulkId}.
 */
export interface BulkVerifyResultItem {
  subscriptionId: string;
  externalReference?: string;
  /** Possible values: "Pending", "Succeeded", "Failed". */
  status: string;
  message?: string;
  code?: string;
  paymentId?: string;
}

/**
 * Response from GET /v1/subscriptions/verifications/{bulkId} (HTTP 200).
 */
export interface BulkVerificationsResponse {
  page?: BulkVerifyResultItem[];
  /** True when there are more results beyond the requested page. */
  more?: boolean;
  /** Possible values: "Done", "Processing". */
  status?: string;
}
