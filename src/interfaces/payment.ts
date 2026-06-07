import type {
  Consumer,
  ConsumerResponse,
  Order,
  OrderItem,
  PaymentMethod,
} from "./common.ts";
import type { EventName } from "./webhook-types.ts";

// ---------------------------------------------------------------------------
// Shared notification / webhook configuration
// ---------------------------------------------------------------------------

/**
 * A single webhook subscription.
 */
export interface WebhookNotification {
  /**
   * The event name to subscribe to (see the webhooks section of the API docs).
   */
  eventName: EventName;

  /**
   * The HTTPS URL that will receive the callback. Max 256 characters.
   */
  url: string;

  /**
   * Value sent in the HTTP Authorization header of the callback.
   * Must be 8–64 alphanumeric characters.
   */
  authorization?: string;
}

/**
 * Notification settings included on create/update requests.
 */
export interface Notifications {
  /**
   * Up to 32 webhook subscriptions.
   */
  webHooks?: WebhookNotification[];
}

// ---------------------------------------------------------------------------
// Create payment — POST /v1/payments
// ---------------------------------------------------------------------------

/**
 * Request body for POST /v1/payments.
 */
export interface CreatePaymentRequest {
  /**
   * The order to be paid.
   */
  order: Order;

  /**
   * Checkout page settings.
   */
  checkout?: {
    /**
     * The URL of the page where the embedded checkout is loaded.
     * Required when integrationType is "EmbeddedCheckout".
     */
    url?: string;

    /**
     * Whether to embed the checkout or host it on a Nexi Group page.
     * Valid values: "EmbeddedCheckout" (default), "HostedPaymentPage".
     */
    integrationType?: "HostedPaymentPage" | "EmbeddedCheckout";

    /**
     * Where the customer returns after a completed hosted checkout.
     */
    returnUrl?: string;

    /**
     * Where the customer returns after cancelling a hosted checkout.
     */
    cancelUrl?: string;

    /**
     * Pre-fill consumer data so the customer only needs to enter payment details.
     * Use either privatePerson or company inside consumer, not both.
     */
    consumer?: Consumer;

    /**
     * URL to your terms and conditions page. Required.
     */
    termsUrl: string;

    /**
     * URL to your privacy and cookie policy page.
     */
    merchantTermsUrl?: string;

    /**
     * Limits the countries available for shipping.
     * If omitted, all supported countries are available.
     */
    shippingCountries?: { countryCode: string }[];

    /**
     * Shipping configuration.
     */
    shipping?: {
      countries?: { countryCode: string }[];
      /**
       * When true the order must be updated with shipping.costSpecified = true
       * before the customer can complete the purchase.
       */
      merchantHandlesShippingCost?: boolean;
      /**
       * When true the customer can specify a separate billing address.
       */
      enableBillingAddress?: boolean;
    };

    /**
     * Which consumer types to accept. Defaults to B2C.
     * Ignored when merchantHandlesConsumerData is true.
     */
    consumerType?: {
      /** The consumer type shown by default on the checkout page. */
      default?: "B2C" | "B2B";
      /** Allowed consumer types. */
      supportedTypes?: Array<"B2C" | "B2B">;
    };

    /**
     * When true the payment is charged automatically after reservation.
     * @default false
     */
    charge?: boolean;

    /**
     * When true the checkout will not load or remember consumer data on this device.
     * @default false
     */
    publicDevice?: boolean;

    /**
     * When true the checkout is pre-filled with the consumer data provided in
     * the consumer object and the consumer does not have to enter personal details.
     */
    merchantHandlesConsumerData?: boolean;

    /**
     * Visual settings for the checkout page.
     */
    appearance?: {
      displayOptions?: {
        /** Show the merchant name above the checkout. */
        showMerchantName?: boolean;
        /** Show the order summary above the checkout. */
        showOrderSummary?: boolean;
      };
      textOptions?: {
        /**
         * Override the payment button text.
         * Allowed values: "pay", "purchase", "order", "book",
         * "reserve", "signup", "subscribe", "accept".
         */
        completePaymentButtonText?: string;
      };
    };

    /**
     * Three-letter ISO 3166-1 country code for the merchant checkout locale.
     * Required for Klarna.
     */
    countryCode?: string;
  };

  /**
   * The merchant number. Only required when using partner integration keys.
   */
  merchantNumber?: string;

  /**
   * Webhook subscriptions for payment status updates.
   */
  notifications?: Notifications;

  /**
   * Attach or create a scheduled subscription.
   */
  subscription?: {
    /**
     * The UUID of an existing subscription to update.
     * If omitted a new subscription is created.
     */
    subscriptionId?: string;

    /**
     * When the subscription expires (ISO 8601 date-time).
     */
    endDate?: string;

    /**
     * Minimum number of days between charges. 0 = no restriction.
     */
    interval?: number;

    /**
     * Allow variable charge amounts on this subscription.
     */
    allowVariableAmount?: boolean;
  };

  /**
   * Attach or create an unscheduled card-on-file agreement.
   */
  unscheduledSubscription?: {
    /**
     * Set to true to create a new unscheduled card-on-file agreement.
     */
    create?: boolean;

    /**
     * The UUID of an existing unscheduled subscription to update.
     */
    unscheduledSubscriptionId?: string;
  };

  /**
   * Per-payment-method enable/disable configuration.
   * All configured methods are enabled by default when this array is absent or empty.
   */
  paymentMethodsConfiguration?: {
    /**
     * The payment method or payment type name.
     * Method names: "Visa", "MasterCard", "Dankort", "AmericanExpress",
     * "Forbrugsforeningen", "PayPal", "Vipps", "MobilePay", "Swish",
     * "Arvato", "EasyInvoice", "EasyInstallment", "EasyCampaign",
     * "RatePayInvoice", "RatePayInstallment", "RatePaySepa", "Sofort",
     * "Trustly", "ApplePay", "Klarna", "GooglePay".
     * Type names: "Card", "Invoice", "Installment", "A2A", "Wallet".
     */
    name?: string;
    enabled?: boolean;
  }[];

  /**
   * Invoice fee per payment method.
   */
  paymentMethods?: PaymentMethod[];

  /**
   * Merchant-side payment reference. Max 36 characters.
   */
  myReference?: string;

  /**
   * Additional data passed to specific payment method providers.
   */
  additionalPaymentMethodData?: {
    riverty?: {
      /** Unique order reference mapped to parentTransactionReference in Riverty. Max 128 characters. */
      orderReference?: string;
    };
    payPal?: {
      /** Order reference mapped to InvoiceId in PayPal. Max 128 characters. */
      orderReference?: string;
    };
  };
}

/**
 * Response from POST /v1/payments (HTTP 201).
 */
export interface CreatePaymentResponse {
  /**
   * The UUID of the newly created payment.
   */
  paymentId: string;

  /**
   * Present when integrationType is "HostedPaymentPage".
   * Redirect your customer to this URL.
   */
  hostedPaymentPageUrl?: string;
}

// ---------------------------------------------------------------------------
// Retrieve payment — GET /v1/payments/{paymentId}
// ---------------------------------------------------------------------------

/**
 * The full payment object returned by GET /v1/payments/{paymentId}.
 */
export interface PaymentObject {
  paymentId: string;

  summary?: {
    reservedAmount?: number;
    reservedSurchargeAmount?: number;
    chargedAmount?: number;
    chargedSurchargeAmount?: number;
    refundedAmount?: number;
    refundedSurchargeAmount?: number;
    /** Note: double-L spelling matches the API. */
    cancelledAmount?: number;
    cancelledSurchargeAmount?: number;
  };

  consumer?: ConsumerResponse;

  paymentDetails?: {
    /** Possible values: "CARD", "INVOICE", "A2A", "INSTALLMENT", "WALLET", "PREPAID-INVOICE". */
    paymentType?: string;
    /** For example "Visa" or "Mastercard". */
    paymentMethod?: string;
    invoiceDetails?: {
      invoiceNumber?: string;
    };
    cardDetails?: {
      /** Masked PAN — at most first 6 and last 4 digits. */
      maskedPan?: string;
      /** Four-digit expiry date in MMYY format. */
      expiryDate?: string;
    };
  };

  /** Note: the API returns this under the key "orderDetails", not "order". */
  orderDetails: {
    amount: number;
    currency: string;
    reference?: string;
  };

  checkout: {
    /** URL to the hosted or embedded checkout page. */
    url: string;
    cancelUrl?: string;
  };

  /** ISO 8601 date-time when the payment was initiated. */
  created: string;

  refunds?: {
    refundId?: string;
    amount?: number;
    surchargeAmount?: number;
    /** Possible values: "Pending", "Cancelled", "Failed", "Completed", "Expired". */
    state?: string;
    lastUpdated?: string;
    orderItems?: OrderItem[];
  }[];

  charges?: {
    chargeId?: string;
    amount?: number;
    surchargeAmount?: number;
    created?: string;
    orderItems?: OrderItem[];
  }[];

  /** ISO 8601 date-time of termination, present only if the payment was terminated. */
  terminated?: string;

  subscription?: {
    id?: string;
  };

  unscheduledSubscription?: {
    unscheduledSubscriptionId?: string;
  };

  myReference?: string;
  paymentAccountReference?: string;
}

/**
 * Response from GET /v1/payments/{paymentId} (HTTP 200).
 */
export interface RetrievePaymentResponse {
  payment: PaymentObject;
}

// ---------------------------------------------------------------------------
// Update reference information — PUT /v1/payments/{paymentId}/referenceinformation
// ---------------------------------------------------------------------------

/**
 * Request body for PUT /v1/payments/{paymentId}/referenceinformation (HTTP 204).
 */
export interface UpdateReferenceInfoRequest {
  /** The new checkout URL. */
  checkoutUrl: string;
  /** The new merchant order reference. */
  reference: string;
}

// ---------------------------------------------------------------------------
// Update order — PUT /v1/payments/{paymentId}/orderitems
// ---------------------------------------------------------------------------

/**
 * Request body for PUT /v1/payments/{paymentId}/orderitems (HTTP 204).
 * Can only be called before the checkout is completed.
 */
export interface UpdateOrderRequest {
  /** Updated base amount. */
  amount?: number;
  /** Updated list of order items. */
  items?: OrderItem[];
  shipping?: {
    /**
     * Must be set to true before the customer can complete the purchase
     * when merchantHandlesShippingCost was enabled on checkout creation.
     */
    costSpecified?: boolean;
  };
  /** Updated payment method invoice fees. */
  paymentMethods?: PaymentMethod[];
}

// ---------------------------------------------------------------------------
// Update myReference — PUT /v1/payments/{paymentId}/myreference
// ---------------------------------------------------------------------------

/**
 * Request body for PUT /v1/payments/{paymentId}/myreference (HTTP 204).
 */
export interface UpdateMyReferenceRequest {
  /** Merchant payment reference. Max 36 characters. */
  myReference?: string;
}

// ---------------------------------------------------------------------------
// Charge payment — POST /v1/payments/{paymentId}/charges
// ---------------------------------------------------------------------------

/**
 * Request body for POST /v1/payments/{paymentId}/charges (HTTP 201).
 */
export interface ChargePaymentRequest {
  /**
   * The base amount to charge. Required.
   * For a full charge this must equal the total reserved amount.
   * For a partial charge provide the amount and the orderItems to charge.
   */
  amount: number;

  /**
   * Order items to charge. Required for partial charges.
   */
  orderItems?: OrderItem[];

  /**
   * Shipping details for fulfilment tracking.
   */
  shipping?: {
    /** Max 255 characters. */
    trackingNumber?: string;
    /** Max 4 characters. */
    provider?: string;
  };

  /**
   * When true, releases the remaining reserved amount after this charge.
   */
  finalCharge?: boolean;

  /**
   * Merchant payment reference. Max 36 characters.
   */
  myReference?: string;

  /**
   * An optional unique reference per payment method.
   * For Riverty/AfterPay this is the invoice number (max 20 characters).
   */
  paymentMethodReference?: string;
}

/**
 * Response from POST /v1/payments/{paymentId}/charges (HTTP 201).
 */
export interface ChargePaymentResponse {
  chargeId: string;
  invoice?: {
    invoiceNumber?: string;
  };
}

// ---------------------------------------------------------------------------
// Cancel payment — POST /v1/payments/{paymentId}/cancels
// ---------------------------------------------------------------------------

/**
 * Request body for POST /v1/payments/{paymentId}/cancels (HTTP 204).
 */
export interface CancelPaymentRequest {
  /**
   * The base amount to cancel. Required.
   * If this equals the full reserved amount a full cancellation is performed.
   * Otherwise a partial cancellation is performed (card payments and wallets only).
   */
  amount: number;

  /**
   * Order items to cancel. Required for partial cancellations.
   */
  orderItems?: OrderItem[];
}

// ---------------------------------------------------------------------------
// Refund payment — POST /v1/payments/{paymentId}/refunds
//                  POST /v1/charges/{chargeId}/refunds
// ---------------------------------------------------------------------------

/**
 * Request body for refund endpoints (HTTP 201).
 * Used by both POST /v1/payments/{paymentId}/refunds and
 * POST /v1/charges/{chargeId}/refunds.
 */
export interface RefundPaymentRequest {
  /**
   * The base amount to refund. Required.
   * For a full refund only amount is needed.
   * For a partial refund provide both amount and orderItems.
   */
  amount: number;

  /**
   * Order items to refund. Required for partial refunds.
   */
  orderItems?: OrderItem[];

  /**
   * Merchant payment reference. Max 36 characters.
   */
  myReference?: string;
}

/**
 * Response from refund endpoints (HTTP 201).
 */
export interface RefundPaymentResponse {
  refundId: string;
}

// ---------------------------------------------------------------------------
// Retrieve charge — GET /v1/charges/{chargeId}
// ---------------------------------------------------------------------------

/**
 * Response from GET /v1/charges/{chargeId} (HTTP 200).
 */
export interface RetrieveChargeResponse {
  chargeId: string;
  amount: number;
  surchargeAmount?: number;
  invoiceDetails?: {
    /** Publicly accessible URL of the invoice. */
    link?: string;
  };
}

// ---------------------------------------------------------------------------
// Retrieve refund — GET /v1/refunds/{refundId}
// ---------------------------------------------------------------------------

/**
 * Response from GET /v1/refunds/{refundId} (HTTP 200).
 */
export interface RetrieveRefundResponse {
  refundId: string;
  amount: number;
  surchargeAmount?: number;
  invoiceDetails?: {
    /** Publicly accessible URL of the invoice. */
    link?: string;
  };
}
