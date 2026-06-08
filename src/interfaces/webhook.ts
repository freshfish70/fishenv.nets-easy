import type { EventName } from "./webhook-types.ts";
import type { WebhookHeader } from "./payment.ts";

/**
 * Webhook notification configuration.
 * Used when subscribing to payment events during payment or subscription creation.
 *
 * This type mirrors WebhookNotification in payment.ts and is provided here as a
 * standalone convenience export.
 */
export interface WebhookConfig {
  /**
   * The event name to subscribe to.
   * See the full list of events in the API docs (webhooks section).
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

  /**
   * Optional additional headers sent with the callback.
   */
  headers?: WebhookHeader[];
}
