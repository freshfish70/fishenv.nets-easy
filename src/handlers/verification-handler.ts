import {
  hasWebhookError,
  isWebhookEventType,
  type PaymentCancelFailedEvent,
  type PaymentChargeFailedEvent,
  type PaymentRefundFailedEvent,
  type PaymentReservationFailedEvent,
  type WebhookEvent,
} from "../interfaces/webhook-types.ts";
import { BaseHandler } from "./base-handler.ts";

/**
 * List of error codes that should never be retried, as per Nets Easy documentation
 * @see https://developer.nexigroup.com/nexi-checkout/en-EU/docs/manage-subscription-retries/
 */
export const NON_RETRYABLE_ERROR_CODES = [
  "04", // Pick up card (no fraud)
  "14", // Invalid account number (no such number)
  "15", // No such issuer
  "41", // Lost card, pick up
  "43", // Stolen card, pick up
  "46", // Closed account
  "54", // Expired card or expiration date missing
  "57", // Transaction not permitted to the cardholder
];

/**
 * Verification handler for checking error codes and subscription status
 */
export class VerificationHandler extends BaseHandler {
  /**
   * Check if a webhook event contains a non-retryable error code
   * @param webhookEvent The webhook event to check
   * @returns True if the event contains a non-retryable error code
   */
  isNonRetryableError(webhookEvent: WebhookEvent): boolean {
    // Only relevant for failed reservations
    if (
      !isWebhookEventType<PaymentReservationFailedEvent>(
        webhookEvent,
        "payment.reservation.failed",
      )
    ) {
      return false;
    }

    if (!hasWebhookError(webhookEvent)) {
      return false;
    }

    // Check if the error code is in the list of non-retryable codes
    const code = webhookEvent.data.error?.code;

    if (!code) {
      return false;
    }

    return NON_RETRYABLE_ERROR_CODES.includes(code);
  }

  /**
   * Safely parse a webhook event from JSON
   * @param jsonData JSON string or object containing the webhook data
   * @returns Parsed webhook event or undefined if invalid
   */
  parseWebhookEvent(jsonData: string | object): WebhookEvent | undefined {
    try {
      const data = typeof jsonData === "string"
        ? JSON.parse(jsonData)
        : jsonData;

      // Basic validation
      if (!data.event || !data.id || !data.timestamp || !data.data) {
        return undefined;
      }

      return data as WebhookEvent;
    } catch {
      return undefined;
    }
  }

  /**
   * Determine if a subscription retry should be attempted based on webhook data
   * @param webhookEvent The webhook event to analyze
   * @param currentRetryCount Current number of retries (default 0)
   * @param maxRetries Maximum number of retries allowed (default 15 per Nets Easy documentation)
   * @returns Object containing shouldRetry status and reason
   */
  shouldRetrySubscription(
    webhookEvent: WebhookEvent,
    currentRetryCount = 0,
    maxRetries = 10,
  ): { shouldRetry: boolean; reason: string } {
    // If it's not a failed reservation, no retry decision needed
    if (
      !isWebhookEventType<PaymentReservationFailedEvent>(
        webhookEvent,
        "payment.reservation.failed",
      )
    ) {
      return {
        shouldRetry: false,
        reason: "Not a failed reservation event",
      };
    }

    if (!hasWebhookError(webhookEvent)) {
      return {
        shouldRetry: false,
        reason: "No error data in webhook event",
      };
    }

    const error = webhookEvent.data.error;

    // Check for non-retryable error codes
    if (this.isNonRetryableError(webhookEvent)) {
      return {
        shouldRetry: false,
        reason: `Error code ${error.code} is non-retryable`,
      };
    }

    // Check retry count limits
    if (currentRetryCount >= maxRetries) {
      return {
        shouldRetry: false,
        reason: `Maximum retry limit (${maxRetries}) reached`,
      };
    }

    // All checks passed, can retry
    return {
      shouldRetry: true,
      reason: "Reservation failed with retryable error code",
    };
  }

  /**
   * Get detailed information about an error from a webhook event
   * @param webhookEvent The webhook event to analyze
   * @returns Error details if present, or undefined
   */
  getErrorDetails(webhookEvent: WebhookEvent):
    | {
      code: string;
      message: string;
      isRetryable: boolean;
    }
    | undefined {
    // Only relevant for events with error data
    if (
      isWebhookEventType<PaymentReservationFailedEvent>(
        webhookEvent,
        "payment.reservation.failed",
      ) ||
      isWebhookEventType<PaymentChargeFailedEvent>(
        webhookEvent,
        "payment.charge.failed",
      ) ||
      isWebhookEventType<PaymentCancelFailedEvent>(
        webhookEvent,
        "payment.cancel.failed",
      ) ||
      isWebhookEventType<PaymentRefundFailedEvent>(
        webhookEvent,
        "payment.refund.failed",
      )
    ) {
      if (!hasWebhookError(webhookEvent)) {
        return undefined;
      }

      const error = webhookEvent.data.error;

      return {
        code: error.code,
        message: error.message,
        isRetryable: !NON_RETRYABLE_ERROR_CODES.includes(error.code),
      };
    }

    return undefined;
  }
}
