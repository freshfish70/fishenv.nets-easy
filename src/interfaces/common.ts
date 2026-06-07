/**
 * Address as supplied in requests (no receiverLine or phoneNumber).
 */
export interface Address {
  /**
   * The primary address line. Must be between 1 and 128 characters.
   */
  addressLine1: string;

  /**
   * An additional address line. Must be between 1 and 128 characters.
   */
  addressLine2?: string;

  /**
   * The postal code.
   */
  postalCode: string;

  /**
   * The city. Must be between 1 and 128 characters.
   */
  city: string;

  /**
   * A three-letter country code (ISO 3166-1), for example GBR.
   */
  country: string;
}

/**
 * Address as returned in API responses.
 * Includes receiverLine and phoneNumber which are read-only fields set by the API.
 */
export interface ResponseAddress {
  addressLine1?: string;
  addressLine2?: string;
  /** The name (or company name) of the customer. */
  receiverLine?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phoneNumber?: PhoneNumber;
}

/**
 * An international phone number.
 */
export interface PhoneNumber {
  /**
   * The country calling code, for example +1.
   * Pattern: ^[+]\d{1,3}$
   */
  prefix?: string;

  /**
   * The phone number without the country code prefix.
   * Pattern: ^[0-9]*$
   */
  number?: string;
}

/**
 * Consumer data supplied when creating a payment (nested inside checkout).
 */
export interface Consumer {
  /**
   * Merchant-side reference for the consumer. Max 128 characters.
   */
  reference?: string;

  /**
   * The email address.
   */
  email?: string;

  /**
   * The shipping address.
   */
  shippingAddress?: Address;

  /**
   * The billing address.
   */
  billingAddress?: Address;

  /**
   * Phone number.
   */
  phoneNumber?: PhoneNumber;

  /**
   * Private person details (use either privatePerson or company, not both).
   */
  privatePerson?: {
    firstName?: string;
    lastName?: string;
  };

  /**
   * Company details (use either company or privatePerson, not both).
   */
  company?: {
    name?: string;
    contact?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

/**
 * Consumer as returned in API responses — richer than the request-side Consumer.
 */
export interface ConsumerResponse {
  shippingAddress?: ResponseAddress;
  billingAddress?: ResponseAddress;
  company?: {
    merchantReference?: string;
    name?: string;
    registrationNumber?: string;
    contactDetails?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: PhoneNumber;
    };
  };
  privatePerson?: {
    merchantReference?: string;
    /** ISO 8601 date-time string. */
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: PhoneNumber;
  };
}

/**
 * A single line item within an order.
 */
export interface OrderItem {
  /**
   * A reference to recognize the product (usually the SKU). Max 128 characters.
   */
  reference: string;

  /**
   * The name of the product. Max 128 characters.
   */
  name: string;

  /**
   * The quantity of the product. Must not be negative.
   */
  quantity: number;

  /**
   * The unit of measurement, for example "pcs", "liters", or "kg". Max 128 characters.
   */
  unit: string;

  /**
   * The price per unit excluding VAT. May be negative.
   */
  unitPrice: number;

  /**
   * The tax/VAT rate in percentage × 100. For example 2500 = 25%.
   * Defaults to 0 if omitted. Must be between 0 and 99 999.
   */
  taxRate?: number;

  /**
   * The tax/VAT amount: unitPrice × quantity × taxRate / 10000.
   * Defaults to 0 if omitted.
   */
  taxAmount?: number;

  /**
   * Total amount including VAT: netTotalAmount + taxAmount. May be negative.
   */
  grossTotalAmount: number;

  /**
   * Total amount excluding VAT: unitPrice × quantity. May be negative.
   */
  netTotalAmount: number;

  /**
   * URL to an image of the product.
   * Supported formats: gif, jpeg, png, webp. Width and height between 100 and 1280 px.
   */
  imageUrl?: string;
}

/**
 * An order associated with a payment.
 */
export interface Order {
  /**
   * The list of order items. At least one item is required.
   */
  items: OrderItem[];

  /**
   * Total base amount including VAT (sum of all grossTotalAmounts). Must be > 0.
   */
  amount: number;

  /**
   * Three-letter ISO 4217 currency code, for example "SEK".
   */
  currency: string;

  /**
   * A merchant reference to identify this order (usually an order number).
   * Max 128 characters.
   */
  reference?: string;
}

/**
 * A payment method with an optional invoice fee.
 * The fee is a full order-item object that will be added to the invoice.
 */
export interface PaymentMethod {
  /**
   * The name of the payment method.
   * Currently the only supported value is "easy-invoice".
   */
  name: string;

  /**
   * Optional invoice fee, expressed as a full order item.
   */
  fee?: OrderItem;
}

/**
 * An error returned by the Nets Easy API.
 *
 * This extends the built-in Error shape and adds Nets-specific metadata.
 */
export interface ApiError extends Error {
  /**
   * Numeric error code (may be an HTTP status code string or a provider code).
   */
  code: string;

  /**
   * The source of the error, for example "internal".
   */
  source?: string;

  /**
   * Per-property validation details.
   */
  details?: {
    property: string;
    message: string;
  }[];
}

/**
 * Successful API response.
 *
 * The `success` discriminator makes it safe to narrow the response:
 *
 * ```ts
 * const result = await nets.payment.create(...);
 *
 * if (result.success) {
 *   result.data.paymentId;
 * } else {
 *   result.error.message;
 * }
 * ```
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error?: never;
}

/**
 * Failed API response.
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  data?: never;
}

/**
 * Generic wrapper for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
