
import {
  ExperticketConfig,
  LanguagesResponse,
  ProvidersResponse,
  CatalogResponse,
  CapacityResponse,
  RealTimePriceResponse,
  ReservationResponse,
  TransactionsResponse,
  CancellationRequestsResponse,
  ApiResponse,
  TransactionDocumentsResponse,
  RealTimePriceSearchParams,
  TransactionCreationParams,
  CancellationSubmissionParams,
  ReservationCreationParams,
  TransactionSearchParams,
  CancellationSearchParams
} from '../types';

/**
 * Centralized constant for price inclusion flag in API requests.
 * @internal
 */
const INCLUDE_PRICES_TRUE = 'true';

/**
 * Custom error class for Experticket API related failures.
 *
 * @remarks
 * This error is thrown when the API returns an unsuccessful status code (Success: false)
 * or when a network-level error occurs.
 */
export class ExperticketApiError extends Error {
  /**
   * Creates an instance of ExperticketApiError.
   * @param message - Human-readable error description.
   * @param errorCode - Numeric error code from the API, if available.
   */
  constructor(public message: string, public errorCode?: number) {
    super(message);
    this.name = 'ExperticketApiError';
  }
}

/**
 * Configuration for an internal API request.
 * @internal
 */
interface RequestConfig {
  /** The relative API endpoint path. */
  endpoint: string;
  /** Fetch options (method, headers, body, etc.). */
  options?: RequestInit;
  /** Query parameters to append to the URL. */
  params?: Record<string, string | number>;
  /** Optional API key to be sent in the X-Api-Key header. */
  apiKey?: string;
}

/**
 * Interacts with the Experticket API for sales and transaction management.
 *
 * @remarks
 * This service handles all communication with the Experticket backend, including
 * authentication via API keys and automatic injection of partner identifiers.
 *
 * It provides methods for catalog discovery, availability checks, reservation creation,
 * and transaction management.
 */
class ExperticketService {
  /**
   * Initializes a new instance of the {@link ExperticketService} class.
   * @param config - The configuration settings for the API client.
   */
  constructor(private readonly config: ExperticketConfig) {}

  /**
   * Retrieves the list of supported languages.
   *
   * @returns A promise that resolves to the languages response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const languages = await service.getLanguages();
   * ```
   */
  async getLanguages(): Promise<LanguagesResponse> {
    return this.request<LanguagesResponse>({
      endpoint: '/AvailableLanguages',
      params: { PartnerId: this.config.partnerId }
    });
  }

  /**
   * Retrieves the list of available ticket providers.
   *
   * @returns A promise that resolves to the providers response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const providers = await service.getProviders();
   * ```
   */
  async getProviders(): Promise<ProvidersResponse> {
    return this.request<ProvidersResponse>({
      endpoint: '/providers',
      params: {
        PartnerId: this.config.partnerId,
        LanguageCode: this.config.languageCode
      }
    });
  }

  /**
   * Retrieves the full product catalog for the configured partner.
   *
   * @returns A promise that resolves to the catalog response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const catalog = await service.getCatalog();
   * ```
   */
  async getCatalog(): Promise<CatalogResponse> {
    return this.request<CatalogResponse>({
      endpoint: '/catalog',
      params: {
        PartnerId: this.config.partnerId,
        LanguageCode: this.config.languageCode
      }
    });
  }

  /**
   * Checks the available capacity for specific products and dates.
   *
   * @param productIds - Array of product identifiers to check.
   * @param dates - Array of dates in YYYY-MM-DD format.
   * @returns A promise that resolves to the capacity information.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const capacity = await service.checkCapacity(['p1', 'p2'], ['2024-01-01']);
   * ```
   */
  async checkCapacity(productIds: string[], dates: string[]): Promise<CapacityResponse> {
    return this.request<CapacityResponse>({
      endpoint: '/availablecapacity',
      params: {
        PartnerId: this.config.partnerId,
        ProductIds: productIds.join(','),
        Dates: dates.join(','),
        IncludePrices: INCLUDE_PRICES_TRUE
      }
    });
  }

  /**
   * Retrieves real-time pricing for products within a date range.
   *
   * @param searchParams - The search criteria including product IDs and date range.
   * @returns A promise that resolves to the {@link RealTimePriceResponse}.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const prices = await service.getRealTimePrices({
   *   productIds: ['p1'],
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-07'
   * });
   * ```
   */
  async getRealTimePrices(searchParams: RealTimePriceSearchParams): Promise<RealTimePriceResponse> {
    return this.post<RealTimePriceResponse>('/RealTimePrices', {
      PartnerId: this.config.partnerId,
      ProductIds: searchParams.productIds,
      StartDate: searchParams.startDate,
      EndDate: searchParams.endDate
    });
  }

  /**
   * Creates a temporary reservation for one or more products.
   *
   * @param params - The reservation details including access time and products.
   * @returns A promise that resolves to the reservation details.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const reservation = await service.createReservation({
   *   accessDateTime: '2024-01-01T10:00:00',
   *   products: [{ ProductId: 'p1', Quantity: 2 }]
   * });
   * ```
   */
  async createReservation(params: ReservationCreationParams): Promise<ReservationResponse> {
    return this.post<ReservationResponse>('/reservation', {
      AccessDateTime: params.accessDateTime,
      Products: params.products
    });
  }

  /**
   * Finalizes a transaction from an existing reservation.
   *
   * @param params - The parameters required to create the transaction.
   * @returns A promise that resolves to the API response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * await service.createTransaction({
   *   reservationId: 'res123',
   *   accessDate: '2024-01-01',
   *   products: [{ ProductId: 'p1' }]
   * });
   * ```
   */
  async createTransaction(params: TransactionCreationParams): Promise<ApiResponse> {
    return this.post<ApiResponse>('/transaction', {
      ReservationId: params.reservationId,
      AccessDateTime: params.accessDate,
      Products: params.products
    });
  }

  /**
   * Retrieves a list of transactions matching the provided filters.
   *
   * @param searchParams - Optional filters for the transaction list.
   * @returns A promise that resolves to the transactions response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const transactions = await service.getTransactions({ PageSize: 10 });
   * ```
   */
  async getTransactions(searchParams: TransactionSearchParams = {}): Promise<TransactionsResponse> {
    return this.request<TransactionsResponse>({
      endpoint: '/transaction',
      apiKey: this.config.apiKey,
      params: {
        ...(searchParams as Record<string, string | number>)
      }
    });
  }

  /**
   * Retrieves a list of cancellation requests.
   *
   * @param searchParams - Optional filters for the cancellation requests list.
   * @returns A promise that resolves to the cancellation requests response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const requests = await service.getCancellationRequests({ Status: 0 });
   * ```
   */
  async getCancellationRequests(searchParams: CancellationSearchParams = {}): Promise<CancellationRequestsResponse> {
    return this.request<CancellationRequestsResponse>({
      endpoint: '/cancellationrequest',
      apiKey: this.config.apiKey,
      params: {
        ...(searchParams as Record<string, string | number>)
      }
    });
  }

  /**
   * Submits a request to cancel a specific sale/transaction.
   *
   * @param params - The cancellation details.
   * @returns A promise that resolves to the API response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * await service.submitCancellation({
   *   saleId: 'sale123',
   *   reason: 1,
   *   comments: 'Customer requested change'
   * });
   * ```
   */
  async submitCancellation(params: CancellationSubmissionParams): Promise<ApiResponse> {
    return this.post<ApiResponse>('/cancellationrequest', {
      SaleId: params.saleId,
      Reason: params.reason,
      ReasonComments: params.comments || ''
    });
  }

  /**
   * Retrieves links to documents (e.g., tickets) for a specific transaction.
   *
   * @param transactionId - The unique identifier of the transaction.
   * @returns A promise that resolves to the transaction documents response.
   * @throws {@link ExperticketApiError} If the network request fails or the API returns an error.
   *
   * @example
   * ```typescript
   * const docs = await service.getTransactionDocuments('sale123');
   * ```
   */
  async getTransactionDocuments(transactionId: string): Promise<TransactionDocumentsResponse> {
    return this.request<TransactionDocumentsResponse>({
      endpoint: '/transactiondocuments',
      apiKey: this.config.apiKey,
      params: {
        id: transactionId,
        IncludeTransactionDocumentsLanguages: INCLUDE_PRICES_TRUE
      }
    });
  }

  /**
   * Performs a POST request to the API.
   * @internal
   * @param endpoint - The API endpoint.
   * @param body - The request payload.
   * @returns A promise that resolves to the typed API response.
   */
  private async post<T extends ApiResponse>(endpoint: string, body: object): Promise<T> {
    return this.request<T>({
      endpoint,
      apiKey: this.config.apiKey,
      options: {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          IsTest: this.config.isTest
        })
      }
    });
  }

  /**
   * Executes a network request and handles common response logic.
   * @internal
   * @param config - The request configuration.
   * @returns A promise that resolves to the typed API response.
   */
  private async request<T extends ApiResponse>(config: RequestConfig): Promise<T> {
    try {
      const { endpoint, options = {}, params = {}, apiKey } = config;
      const url = this.buildUrl(endpoint, params);
      const response = await this.executeFetch(url, options, apiKey);
      const data = await this.parseResponse<T>(response);

      this.validateResponse(data, response);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Builds a full URL with query parameters.
   * @internal
   * @param endpoint - The API endpoint.
   * @param params - The query parameters.
   * @returns The constructed URL object.
   */
  private buildUrl(endpoint: string, params: Record<string, string | number>): URL {
    const url = new URL(`https://${this.config.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return url;
  }

  /**
   * Wraps the native fetch API with standard headers.
   * @internal
   * @param url - The target URL.
   * @param options - The fetch options.
   * @param apiKey - Optional API key for X-Api-Key header.
   * @returns A promise that resolves to the fetch Response.
   */
  private async executeFetch(url: URL, options: RequestInit, apiKey?: string): Promise<Response> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (apiKey) {
      headers['X-Api-Key'] = apiKey;
    }

    return fetch(url.toString(), { ...options, headers });
  }

  /**
   * Parses the JSON response body.
   * @internal
   * @param response - The fetch Response.
   * @returns A promise that resolves to the parsed JSON data.
   * @throws {@link ExperticketApiError} If parsing fails.
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    try {
      return await response.json();
    } catch {
      throw new ExperticketApiError('Failed to parse API response');
    }
  }

  /**
   * Validates the API response for logical errors.
   * @internal
   * @param data - The parsed API response.
   * @param response - The fetch Response object.
   * @throws {@link ExperticketApiError} If the API reports an error or the status is not OK.
   */
  private validateResponse(data: ApiResponse, response: Response): void {
    if (!response.ok || data.Success === false) {
      throw new ExperticketApiError(
        data.ErrorMessage || `API Error: ${response.statusText}`,
        data.ErrorCode
      );
    }
  }

  /**
   * Normalizes any error into an ExperticketApiError.
   * @internal
   * @param error - The error to normalize.
   * @returns An instance of ExperticketApiError.
   */
  private handleError(error: unknown): ExperticketApiError {
    if (error instanceof ExperticketApiError) return error;
    return new ExperticketApiError(
      error instanceof Error ? error.message : 'Unknown network error'
    );
  }
}

export default ExperticketService;
