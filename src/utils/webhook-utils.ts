import type { Notifications } from "../interfaces/payment.ts";
import type { EventName } from "../interfaces/webhook-types.ts";

export const ALL_WEBHOOK_EVENT_NAMES: EventName[] = [
  "payment.checkout.completed",
  "payment.created",
  "payment.reservation.created",
  "payment.reservation.created.v2",
  "payment.reservation.failed",
  "payment.charge.created",
  "payment.charge.created.v2",
  "payment.charge.failed",
  "payment.charge.failed.v2",
  "payment.cancel.created",
  "payment.cancel.failed",
  "payment.refund.initiated",
  "payment.refund.initiated.v2",
  "payment.refund.completed",
  "payment.refund.failed",
];

export const PAYMENT_LIFECYCLE_WEBHOOK_EVENT_NAMES: EventName[] = [
  "payment.checkout.completed",
  "payment.created",
  "payment.reservation.created",
  "payment.reservation.created.v2",
  "payment.reservation.failed",
  "payment.charge.created",
  "payment.charge.created.v2",
  "payment.charge.failed",
  "payment.charge.failed.v2",
  "payment.cancel.created",
  "payment.cancel.failed",
  "payment.refund.initiated",
  "payment.refund.initiated.v2",
  "payment.refund.completed",
  "payment.refund.failed",
];

export const SUBSCRIPTION_CHARGE_WEBHOOK_EVENT_NAMES: EventName[] = [
  "payment.charge.created.v2",
  "payment.charge.failed.v2",
  "payment.reservation.failed",
];

/**
 * Convenience helpers for building webhook notification payloads.
 */
export class WebhookUtils {
  /**
   * Create a notifications object where all webhook events use the same URL
   * and optional authorization header.
   */
  create(
    eventNames: EventName[],
    url: string,
    token?: string,
  ): Notifications {
    return {
      webHooks: eventNames.map((eventName) => ({
        eventName,
        url,
        authorization: token,
      })),
    };
  }

  /**
   * Subscribe to all currently modelled webhook events.
   */
  all(url: string, token?: string): Notifications {
    return this.create(ALL_WEBHOOK_EVENT_NAMES, url, token);
  }

  /**
   * Subscribe to the full payment lifecycle.
   */
  paymentLifecycle(url: string, token?: string): Notifications {
    return this.create(PAYMENT_LIFECYCLE_WEBHOOK_EVENT_NAMES, url, token);
  }

  /**
   * Subscribe to recurring/subscription charge events.
   */
  subscriptionCharge(url: string, token?: string): Notifications {
    return this.create(SUBSCRIPTION_CHARGE_WEBHOOK_EVENT_NAMES, url, token);
  }
}
