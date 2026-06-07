import type {
  ApiError,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "../interfaces/common.ts";
import type { NetsEasyOptions } from "../interfaces/options.ts";

const TEST_BASE_URL = "https://test.api.dibspayment.eu/v1";
const PROD_BASE_URL = "https://api.dibspayment.eu/v1";

function createApiError(
  code: string,
  message: string,
  source?: string,
  details?: ApiError["details"],
): ApiError {
  const error = new Error(message) as ApiError;
  error.name = "ApiError";
  error.code = code;
  error.source = source;
  error.details = details;
  return error;
}

/**
 * Base handler that owns the HTTP transport layer.
 * All domain handlers extend this class.
 */
export abstract class BaseHandler {
  protected options: NetsEasyOptions;
  protected apiBaseUrl: string;

  constructor(options: NetsEasyOptions) {
    this.options = options;
    this.apiBaseUrl = options.apiBaseUrl ??
      (options.environment === "prod" ? PROD_BASE_URL : TEST_BASE_URL);
  }

  /**
   * Makes an authenticated request to the Nets Easy API.
   *
   * @param method  HTTP verb
   * @param endpoint  Path appended to apiBaseUrl, e.g. "/payments"
   * @param data  Optional request body (will be JSON-serialised)
   * @returns Resolved ApiResponse — never rejects; network/parse errors are
   *          returned as an ApiError with code "REQUEST_ERROR".
   */
  protected async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${this.apiBaseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // The Nets Easy API expects the secret key directly — no "Bearer" prefix.
      Authorization: this.options.secretKey,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data !== undefined ? JSON.stringify(data) : undefined,
        signal: this.options.timeout
          ? AbortSignal.timeout(this.options.timeout)
          : undefined,
      });

      // 204 No Content — successful but no body.
      if (response.status === 204) {
        const result: ApiSuccessResponse<T> = {
          success: true,
          data: undefined as T,
        };
        return result;
      }

      const responseData = await response.json();

      if (!response.ok) {
        const error = createApiError(
          responseData.code ?? `HTTP_ERROR_${response.status}`,
          responseData.message ??
            `Request failed with status ${response.status}`,
          responseData.source,
          responseData.details,
        );
        const result: ApiErrorResponse = {
          success: false,
          error,
        };
        return result;
      }

      const result: ApiSuccessResponse<T> = {
        success: true,
        data: responseData as T,
      };
      return result;
    } catch (err) {
      const apiError = createApiError(
        "REQUEST_ERROR",
        err instanceof Error ? err.message : "Unknown error occurred",
        "client",
      );
      const result: ApiErrorResponse = {
        success: false,
        error: apiError,
      };
      return result;
    }
  }
}
