import type { ApiResponse } from "../interfaces/common.ts";
import type {
  CancelPaymentRequest,
  ChargePaymentRequest,
  ChargePaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  RetrieveChargeResponse,
  RetrievePaymentResponse,
  UpdateMyReferenceRequest,
  UpdateOrderRequest,
  UpdateReferenceInfoRequest,
} from "../interfaces/payment.ts";
import { BaseHandler } from "./base-handler.ts";

/**
 * Handler for all payment-related endpoints.
 *
 * Endpoint map:
 *   POST   /v1/payments                                     → create()
 *   GET    /v1/payments/{paymentId}                         → get()
 *   PUT    /v1/payments/{paymentId}/referenceinformation    → updateReferenceInfo()
 *   PUT    /v1/payments/{paymentId}/orderitems              → updateOrder()
 *   PUT    /v1/payments/{paymentId}/myreference             → updateMyReference()
 *   PUT    /v1/payments/{paymentId}/terminate               → terminate()
 *   POST   /v1/payments/{paymentId}/charges                 → charge()
 *   GET    /v1/charges/{chargeId}                           → getCharge()
 *   POST   /v1/payments/{paymentId}/cancels                 → cancel()
 */
export class PaymentHandler extends BaseHandler {
  /**
   * Creates a new payment object.
   * POST /v1/payments → 201 Created
   */
  create(
    data: CreatePaymentRequest,
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    return this.request<CreatePaymentResponse>("POST", "/payments", data);
  }

  /**
   * Retrieves the details of an existing payment.
   * GET /v1/payments/{paymentId} → 200 OK
   *
   * Rate-limited to 30 calls per payment per hour.
   */
  get(paymentId: string): Promise<ApiResponse<RetrievePaymentResponse>> {
    return this.request<RetrievePaymentResponse>(
      "GET",
      `/payments/${paymentId}`,
    );
  }

  /**
   * Updates the checkout URL and order reference on a payment.
   * PUT /v1/payments/{paymentId}/referenceinformation → 204 No Content
   */
  updateReferenceInfo(
    paymentId: string,
    data: UpdateReferenceInfoRequest,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      "PUT",
      `/payments/${paymentId}/referenceinformation`,
      data,
    );
  }

  /**
   * Updates the order (items, amount, shipping) on a payment.
   * Can only be called before the checkout is completed.
   * PUT /v1/payments/{paymentId}/orderitems → 204 No Content
   */
  updateOrder(
    paymentId: string,
    data: UpdateOrderRequest,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      "PUT",
      `/payments/${paymentId}/orderitems`,
      data,
    );
  }

  /**
   * Updates the merchant reference on a payment.
   * PUT /v1/payments/{paymentId}/myreference → 204 No Content
   */
  updateMyReference(
    paymentId: string,
    data: UpdateMyReferenceRequest,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      "PUT",
      `/payments/${paymentId}/myreference`,
      data,
    );
  }

  /**
   * Terminates an ongoing checkout session.
   * Can only be called before the checkout is completed.
   * PUT /v1/payments/{paymentId}/terminate → 204 No Content
   */
  terminate(paymentId: string): Promise<ApiResponse<void>> {
    return this.request<void>("PUT", `/payments/${paymentId}/terminate`);
  }

  /**
   * Charges (captures) a reserved payment, fully or partially.
   * POST /v1/payments/{paymentId}/charges → 201 Created
   */
  charge(
    paymentId: string,
    data: ChargePaymentRequest,
  ): Promise<ApiResponse<ChargePaymentResponse>> {
    return this.request<ChargePaymentResponse>(
      "POST",
      `/payments/${paymentId}/charges`,
      data,
    );
  }

  /**
   * Retrieves details of a specific charge.
   * GET /v1/charges/{chargeId} → 200 OK
   */
  getCharge(chargeId: string): Promise<ApiResponse<RetrieveChargeResponse>> {
    return this.request<RetrieveChargeResponse>("GET", `/charges/${chargeId}`);
  }

  /**
   * Cancels (voids) a reserved payment, fully or partially.
   * POST /v1/payments/{paymentId}/cancels → 204 No Content
   */
  cancel(
    paymentId: string,
    data: CancelPaymentRequest,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      "POST",
      `/payments/${paymentId}/cancels`,
      data,
    );
  }
}
