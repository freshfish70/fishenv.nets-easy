/**
 * Configuration options for the Nets Easy API client
 */
export interface NetsEasyOptions {
  /**
   * The secret key (integration key) for the Nets Easy API.
   * Found in the Easy Portal under Integration → Keys.
   */
  secretKey: string;

  /**
   * Override the API base URL.
   * When omitted the URL is derived from the `environment` option:
   *   test → https://test.api.dibspayment.eu/v1
   *   prod → https://api.dibspayment.eu/v1
   */
  apiBaseUrl?: string;

  /**
   * Timeout in milliseconds for API requests.
   * @default 30000
   */
  timeout?: number;

  /**
   * Which Nets Easy environment to target.
   * @default "test"
   */
  environment?: "test" | "prod";
}
