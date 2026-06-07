import { PaymentHandler } from "./handlers/payment-handler.ts";
import { RefundHandler } from "./handlers/refund-handler.ts";
import { SubscriptionHandler } from "./handlers/subscription-handler.ts";
import { VerificationHandler } from "./handlers/verification-handler.ts";
import type { NetsEasyOptions } from "./interfaces/options.ts";
import { WebhookUtils } from "./utils/webhook-utils.ts";

export class NetsEasy {
  private options: NetsEasyOptions;
  private _payment: PaymentHandler;
  private _subscription: SubscriptionHandler;
  private _refund: RefundHandler;
  private _verification: VerificationHandler;
  private _utils: {
    webhooks: WebhookUtils;
  };

  constructor(options: NetsEasyOptions) {
    this.options = options;
    this._payment = new PaymentHandler(this.options);
    this._subscription = new SubscriptionHandler(this.options);
    this._refund = new RefundHandler(this.options);
    this._verification = new VerificationHandler(this.options);
    this._utils = {
      webhooks: new WebhookUtils(),
    };
  }

  /**
   * Payment operations:
   *   create(), get(), updateReferenceInfo(), updateOrder(),
   *   updateMyReference(), terminate(), charge(), getCharge(), cancel()
   */
  get payment(): PaymentHandler {
    return this._payment;
  }

  /**
   * Subscription operations:
   *   get(), getByExternalReference(), charge(), bulkCharge(),
   *   getBulkCharges(), bulkVerify(), getBulkVerifications()
   *
   * Note: subscriptions are *created* via payment.create() by including
   * a `subscription` object in the CreatePaymentRequest.
   */
  get subscription(): SubscriptionHandler {
    return this._subscription;
  }

  /**
   * Refund operations:
   *   create(), createFromCharge(), get(), cancelPending()
   */
  get refund(): RefundHandler {
    return this._refund;
  }

  /**
   * Webhook verification and subscription-retry helpers.
   */
  get verification(): VerificationHandler {
    return this._verification;
  }

  /**
   * Convenience utilities for building request payloads.
   */
  get utils(): { webhooks: WebhookUtils } {
    return this._utils;
  }
}

// Re-export all public types so consumers can import from this single entry point.
export * from "./codes.js";
export * from "./interfaces/common.js";
export * from "./interfaces/options.js";
export * from "./interfaces/payment.js";
export * from "./interfaces/subscription.js";
export * from "./interfaces/webhook-types.js";
export * from "./interfaces/webhook.js";
export * from "./utils/webhook-utils.js";
