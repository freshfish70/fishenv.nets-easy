import type { ApiResponse } from "../interfaces/common.ts";
import type {
  RefundPaymentRequest,
  RefundPaymentResponse,
  RetrieveRefundResponse,
} from "../interfaces/payment.ts";
import { BaseHandler } from "./base-handler.ts";

/**
 * Handler for all refund-related endpoints.
 *
 * Endpoint map:
 *   POST /v1/payments/{paymentId}/refunds        → create()
 *   POST /v1/charges/{chargeId}/refunds          → createFromCharge()
 *   GET  /v1/refunds/{refundId}                  → get()
 *   POST /v1/pending-refunds/{refundId}/cancel   → cancelPending()
 */
export class RefundHandler extends BaseHandler {
  /**
   * Refunds a settled payment by payment ID, fully or partially.
   * Not supported for Arvato, PayPal, RatePay, EasyInvoice, EasyCampaign,
   * or EasyInstallment payment methods — use createFromCharge() instead.
   * POST /v1/payments/{paymentId}/refunds → 201 Created
   */
  create(
    paymentId: string,
    data: RefundPaymentRequest,
  ): Promise<ApiResponse<RefundPaymentResponse>> {
    return this.request<RefundPaymentResponse>(
      "POST",
      `/payments/${paymentId}/refunds`,
      data,
    );
  }

  /**
   * Refunds a settled payment by charge ID, fully or partially.
   * POST /v1/charges/{chargeId}/refunds → 201 Created
   */
  createFromCharge(
    chargeId: string,
    data: RefundPaymentRequest,
  ): Promise<ApiResponse<RefundPaymentResponse>> {
    return this.request<RefundPaymentResponse>(
      "POST",
      `/charges/${chargeId}/refunds`,
      data,
    );
  }

  /**
   * Retrieves details of an existing refund.
   * GET /v1/refunds/{refundId} → 200 OK
   */
  get(refundId: string): Promise<ApiResponse<RetrieveRefundResponse>> {
    return this.request<RetrieveRefundResponse>("GET", `/refunds/${refundId}`);
  }

  /**
   * Cancels a pending refund (one where there are insufficient merchant funds).
   * POST /v1/pending-refunds/{refundId}/cancel → 204 No Content
   */
  cancelPending(refundId: string): Promise<ApiResponse<void>> {
    return this.request<void>(
      "POST",
      `/pending-refunds/${refundId}/cancel`,
    );
  }
}
