import type { ApiResponse } from "../interfaces/common.ts";
import type {
  BulkChargesResponse,
  BulkChargeSubscriptionsRequest,
  BulkChargeSubscriptionsResponse,
  BulkVerificationsResponse,
  BulkVerifySubscriptionsRequest,
  BulkVerifySubscriptionsResponse,
  ChargeSubscriptionRequest,
  ChargeSubscriptionResponse,
  SubscriptionDetails,
} from "../interfaces/subscription.ts";
import { BaseHandler } from "./base-handler.ts";

/**
 * Handler for all subscription-related endpoints.
 *
 * Note: subscriptions are not created through this handler. A subscription is
 * created by including a `subscription` object in CreatePaymentRequest when
 * calling PaymentHandler.create(). The subscriptionId is then obtained from
 * the payment via PaymentHandler.get().
 *
 * Endpoint map:
 *   GET  /v1/subscriptions/{subscriptionId}                  → get()
 *   GET  /v1/subscriptions?externalReference={ref}           → getByExternalReference()
 *   POST /v1/subscriptions/{subscriptionId}/charges          → charge()
 *   POST /v1/subscriptions/charges                           → bulkCharge()
 *   GET  /v1/subscriptions/charges/{bulkId}                  → getBulkCharges()
 *   POST /v1/subscriptions/verifications                     → bulkVerify()
 *   GET  /v1/subscriptions/verifications/{bulkId}            → getBulkVerifications()
 */
export class SubscriptionHandler extends BaseHandler {
  /**
   * Retrieves an existing subscription.
   * GET /v1/subscriptions/{subscriptionId} → 200 OK
   */
  get(subscriptionId: string): Promise<ApiResponse<SubscriptionDetails>> {
    return this.request<SubscriptionDetails>(
      "GET",
      `/subscriptions/${subscriptionId}`,
    );
  }

  /**
   * Retrieves a subscription by its external reference.
   * Only applicable to subscriptions imported from an external platform.
   * GET /v1/subscriptions?externalReference={ref} → 200 OK
   */
  getByExternalReference(
    externalReference: string,
  ): Promise<ApiResponse<SubscriptionDetails>> {
    return this.request<SubscriptionDetails>(
      "GET",
      `/subscriptions?externalReference=${
        encodeURIComponent(externalReference)
      }`,
    );
  }

  /**
   * Charges a single subscription, creating a new payment object.
   * POST /v1/subscriptions/{subscriptionId}/charges → 200 OK
   */
  charge(
    subscriptionId: string,
    data: ChargeSubscriptionRequest,
  ): Promise<ApiResponse<ChargeSubscriptionResponse>> {
    return this.request<ChargeSubscriptionResponse>(
      "POST",
      `/subscriptions/${subscriptionId}/charges`,
      data,
    );
  }

  /**
   * Charges multiple subscriptions in bulk.
   * POST /v1/subscriptions/charges → 202 Accepted
   *
   * Returns a bulkId; poll getBulkCharges() for results.
   */
  bulkCharge(
    data: BulkChargeSubscriptionsRequest,
  ): Promise<ApiResponse<BulkChargeSubscriptionsResponse>> {
    return this.request<BulkChargeSubscriptionsResponse>(
      "POST",
      "/subscriptions/charges",
      data,
    );
  }

  /**
   * Retrieves the results of a bulk charge operation.
   * GET /v1/subscriptions/charges/{bulkId} → 200 OK
   */
  getBulkCharges(bulkId: string): Promise<ApiResponse<BulkChargesResponse>> {
    return this.request<BulkChargesResponse>(
      "GET",
      `/subscriptions/charges/${bulkId}`,
    );
  }

  /**
   * Verifies multiple subscriptions in bulk.
   * POST /v1/subscriptions/verifications → 202 Accepted
   *
   * Returns a bulkId; poll getBulkVerifications() for results.
   */
  bulkVerify(
    data: BulkVerifySubscriptionsRequest,
  ): Promise<ApiResponse<BulkVerifySubscriptionsResponse>> {
    return this.request<BulkVerifySubscriptionsResponse>(
      "POST",
      "/subscriptions/verifications",
      data,
    );
  }

  /**
   * Retrieves the results of a bulk verification operation.
   * GET /v1/subscriptions/verifications/{bulkId} → 200 OK
   */
  getBulkVerifications(
    bulkId: string,
  ): Promise<ApiResponse<BulkVerificationsResponse>> {
    return this.request<BulkVerificationsResponse>(
      "GET",
      `/subscriptions/verifications/${bulkId}`,
    );
  }
}
