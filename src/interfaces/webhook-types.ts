export type EventName =
  | "payment.checkout.completed"
  | "payment.created"
  | "payment.reservation.created"
  | "payment.reservation.created.v2"
  | "payment.reservation.failed"
  | "payment.charge.created"
  | "payment.charge.created.v2"
  | "payment.charge.failed"
  | "payment.charge.failed.v2"
  | "payment.cancel.created"
  | "payment.cancel.failed"
  | "payment.refund.initiated"
  | "payment.refund.initiated.v2"
  | "payment.refund.completed"
  | "payment.refund.failed";

/**
 * Base webhook event interface.
 */
export interface BaseWebhookEvent {
  id: string;
  event: EventName;
  timestamp: string;
  merchantId: number;
  merchantNumber: number;
}

/**
 * Amount object in webhook responses.
 */
export interface WebhookAmount {
  amount: string;
  currency: string;
}

/**
 * Order item in webhook responses.
 */
export interface WebhookOrderItem {
  grossTotalAmount: string;
  name: string;
  netTotalAmount: string;
  quantity: string;
  reference: string;
  taxRate: string;
  taxAmount: string;
  unit: string;
  unitPrice: string;
}

/**
 * Address in webhook responses.
 */
export interface WebhookAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postcode: string;
  receiverLine?: string;
}

/**
 * Phone number in webhook responses.
 */
export interface WebhookPhoneNumber {
  prefix: string;
  number: string;
}

/**
 * Consumer information in webhook responses.
 */
export interface WebhookConsumer {
  billingAddress?: WebhookAddress;
  country?: string;
  email?: string;
  ip?: string;
  merchantReference?: string;
  phoneNumber?: WebhookPhoneNumber;
  shippingAddress?: WebhookAddress;
}

/**
 * Order information in webhook responses.
 */
export interface WebhookOrder {
  amount: WebhookAmount;
  reference: string;
  description?: string;
  orderItems?: WebhookOrderItem[];
}

/**
 * Card details in webhook responses.
 */
export interface WebhookCardDetails {
  creditDebitIndicator?: string;
  expiryMonth?: string;
  expiryYear?: string;
  issuerCountry?: string;
  truncatedPan?: string;
  threeDSecure?: {
    acsUrl?: string;
    authenticationEnrollmentStatus?: string;
    authenticationStatus?: string;
    eci?: string;
  };
}

/**
 * Invoice details present on some charge/refund webhooks.
 */
export interface WebhookInvoiceDetails {
  accountNumber?: string;
  distributionType?: string;
  invoiceDueDate?: string;
  invoiceNumber?: string;
  ocrOrkid?: string;
  ourReference?: string;
  yourReference?: string;
}

/**
 * Error information in webhook responses.
 */
export interface WebhookError {
  code: string;
  message: string;
  source: string;
  details?: Array<{
    property: string;
    message: string;
  }>;
}

/**
 * payment.checkout.completed webhook event.
 */
export interface PaymentCheckoutCompletedEvent extends BaseWebhookEvent {
  event: "payment.checkout.completed";
  data: {
    order: WebhookOrder;
    consumer?: WebhookConsumer;
    myReference?: string;
    paymentId: string;
  };
}

/**
 * payment.created webhook event.
 */
export interface PaymentCreatedEvent extends BaseWebhookEvent {
  event: "payment.created";
  data: {
    order: WebhookOrder;
    myReference?: string;
    subscriptionId?: string;
    paymentId: string;
  };
}

/**
 * payment.reservation.created webhook event.
 */
export interface PaymentReservationCreatedEvent extends BaseWebhookEvent {
  event: "payment.reservation.created";
  data: {
    cardDetails?: WebhookCardDetails;
    paymentMethod?: string;
    paymentType?: string;
    consumer?: WebhookConsumer;
    reservationReference?: string;
    reserveId?: string;
    myReference?: string;
    reconciliationReference?: string;
    paymentAccountReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.reservation.created.v2 webhook event.
 */
export interface PaymentReservationCreatedV2Event extends BaseWebhookEvent {
  event: "payment.reservation.created.v2";
  data: {
    paymentMethod?: string;
    paymentType?: string;
    subscriptionId?: string;
    myReference?: string;
    reconciliationReference?: string;
    paymentAccountReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.reservation.failed webhook event.
 */
export interface PaymentReservationFailedEvent extends BaseWebhookEvent {
  event: "payment.reservation.failed";
  data: {
    error?: WebhookError;
    orderItems?: WebhookOrderItem[];
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.charge.created webhook event.
 */
export interface PaymentChargeCreatedEvent extends BaseWebhookEvent {
  event: "payment.charge.created";
  data: {
    chargeId: string;
    invoiceDetails?: WebhookInvoiceDetails;
    orderItems?: WebhookOrderItem[];
    reservationId?: string;
    reconciliationReference?: string;
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.charge.created.v2 webhook event.
 */
export interface PaymentChargeCreatedV2Event extends BaseWebhookEvent {
  event: "payment.charge.created.v2";
  data: {
    chargeId: string;
    orderItems?: WebhookOrderItem[];
    paymentMethod?: string;
    paymentType?: string;
    subscriptionId?: string;
    reconciliationReference?: string;
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.charge.failed webhook event.
 */
export interface PaymentChargeFailedEvent extends BaseWebhookEvent {
  event: "payment.charge.failed";
  data: {
    error: WebhookError;
    chargeId?: string;
    invoiceDetails?: WebhookInvoiceDetails;
    orderItems?: WebhookOrderItem[];
    reservationId?: string;
    reconciliationReference?: string;
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.charge.failed.v2 webhook event.
 */
export interface PaymentChargeFailedV2Event extends BaseWebhookEvent {
  event: "payment.charge.failed.v2";
  data: {
    error: WebhookError;
    chargeId?: string;
    orderItems?: WebhookOrderItem[];
    paymentMethod?: string;
    paymentType?: string;
    subscriptionId?: string;
    reconciliationReference?: string;
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.cancel.created webhook event.
 */
export interface PaymentCancelCreatedEvent extends BaseWebhookEvent {
  event: "payment.cancel.created";
  data: {
    cancelId: string;
    orderItems?: WebhookOrderItem[];
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.cancel.failed webhook event.
 */
export interface PaymentCancelFailedEvent extends BaseWebhookEvent {
  event: "payment.cancel.failed";
  data: {
    error: WebhookError;
    cancelId?: string;
    orderItems?: WebhookOrderItem[];
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.refund.initiated webhook event.
 */
export interface PaymentRefundInitiatedEvent extends BaseWebhookEvent {
  event: "payment.refund.initiated";
  data: {
    refundId: string;
    chargeId: string;
    orderItems?: WebhookOrderItem[];
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.refund.initiated.v2 webhook event.
 */
export interface PaymentRefundInitiatedV2Event extends BaseWebhookEvent {
  event: "payment.refund.initiated.v2";
  data: {
    refundId: string;
    chargeId: string;
    orderItems?: WebhookOrderItem[];
    myReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.refund.completed webhook event.
 */
export interface PaymentRefundCompletedEvent extends BaseWebhookEvent {
  event: "payment.refund.completed";
  data: {
    refundId: string;
    invoiceDetails?: WebhookInvoiceDetails;
    reconciliationReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * payment.refund.failed webhook event.
 */
export interface PaymentRefundFailedEvent extends BaseWebhookEvent {
  event: "payment.refund.failed";
  data: {
    error: WebhookError;
    refundId: string;
    invoiceDetails?: WebhookInvoiceDetails;
    reconciliationReference?: string;
    amount: WebhookAmount;
    surchargeAmount?: string;
    paymentId: string;
  };
}

/**
 * Union type of all webhook events.
 */
export type WebhookEvent =
  | PaymentCheckoutCompletedEvent
  | PaymentCreatedEvent
  | PaymentReservationCreatedEvent
  | PaymentReservationCreatedV2Event
  | PaymentReservationFailedEvent
  | PaymentChargeCreatedEvent
  | PaymentChargeCreatedV2Event
  | PaymentChargeFailedEvent
  | PaymentChargeFailedV2Event
  | PaymentCancelCreatedEvent
  | PaymentCancelFailedEvent
  | PaymentRefundInitiatedEvent
  | PaymentRefundInitiatedV2Event
  | PaymentRefundCompletedEvent
  | PaymentRefundFailedEvent;

/**
 * Type guard to check if webhook is a specific event type.
 * @param webhook Webhook event to check
 * @param eventName Name of the event to check
 * @returns Whether the webhook is of the specified event type
 */
export function isWebhookEventType<T extends WebhookEvent>(
  webhook: WebhookEvent,
  eventName: T["event"],
): webhook is T {
  return webhook.event === eventName;
}

export function hasWebhookError(
  webhook: WebhookEvent,
): webhook is WebhookEvent & { data: { error: WebhookError } } {
  const isErrorEventType = webhook.event === "payment.reservation.failed" ||
    webhook.event === "payment.charge.failed" ||
    webhook.event === "payment.charge.failed.v2" ||
    webhook.event === "payment.cancel.failed" ||
    webhook.event === "payment.refund.failed";

  if (!isErrorEventType) {
    return false;
  }

  return "error" in webhook.data;
}
