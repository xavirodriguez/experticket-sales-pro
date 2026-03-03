
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
  CancellationSubmissionParams
} from '../types';

const INCLUDE_PRICES_TRUE = 'true';

export class ExperticketApiError extends Error {
  constructor(public message: string, public errorCode?: number) {
    super(message);
    this.name = 'ExperticketApiError';
  }
}

interface RequestConfig {
  endpoint: string;
  options?: RequestInit;
  params?: Record<string, string | number>;
}

class ExperticketService {
  constructor(private readonly config: ExperticketConfig) {}

  async getLanguages(): Promise<LanguagesResponse> {
    return this.request<LanguagesResponse>({
      endpoint: '/AvailableLanguages',
      params: { PartnerId: this.config.partnerId }
    });
  }

  async getProviders(): Promise<ProvidersResponse> {
    return this.request<ProvidersResponse>({
      endpoint: '/providers',
      params: {
        PartnerId: this.config.partnerId,
        LanguageCode: this.config.languageCode
      }
    });
  }

  async getCatalog(): Promise<CatalogResponse> {
    return this.request<CatalogResponse>({
      endpoint: '/catalog',
      params: {
        PartnerId: this.config.partnerId,
        LanguageCode: this.config.languageCode
      }
    });
  }

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

  async getRealTimePrices(searchParams: RealTimePriceSearchParams): Promise<RealTimePriceResponse> {
    return this.post<RealTimePriceResponse>('/RealTimePrices', {
      PartnerId: this.config.partnerId,
      ProductIds: searchParams.productIds,
      StartDate: searchParams.startDate,
      EndDate: searchParams.endDate
    });
  }

  async createReservation(reservationPayload: { AccessDateTime: string; Products: { ProductId: string; Quantity: number }[] }): Promise<ReservationResponse> {
    return this.post<ReservationResponse>('/reservation', reservationPayload);
  }

  async createTransaction(transactionParams: TransactionCreationParams): Promise<ApiResponse> {
    return this.post<ApiResponse>('/transaction', {
      ReservationId: transactionParams.reservationId,
      AccessDateTime: transactionParams.accessDate,
      Products: transactionParams.products
    });
  }

  async getTransactions(searchParams: Record<string, string | number> = {}): Promise<TransactionsResponse> {
    return this.request<TransactionsResponse>({
      endpoint: '/transaction',
      params: {
        ApiKey: this.config.apiKey,
        ...searchParams
      }
    });
  }

  async getCancellationRequests(searchParams: Record<string, string | number> = {}): Promise<CancellationRequestsResponse> {
    return this.request<CancellationRequestsResponse>({
      endpoint: '/cancellationrequest',
      params: {
        ApiKey: this.config.apiKey,
        ...searchParams
      }
    });
  }

  async submitCancellation(cancellationParams: CancellationSubmissionParams): Promise<ApiResponse> {
    return this.post<ApiResponse>('/cancellationrequest', {
      SaleId: cancellationParams.saleId,
      Reason: cancellationParams.reason,
      ReasonComments: cancellationParams.comments || ''
    });
  }

  async getTransactionDocuments(transactionId: string): Promise<TransactionDocumentsResponse> {
    return this.request<TransactionDocumentsResponse>({
      endpoint: '/transactiondocuments',
      params: {
        ApiKey: this.config.apiKey,
        id: transactionId,
        IncludeTransactionDocumentsLanguages: INCLUDE_PRICES_TRUE
      }
    });
  }

  private async post<T extends ApiResponse>(endpoint: string, body: object): Promise<T> {
    return this.request<T>({
      endpoint,
      options: {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          ApiKey: this.config.apiKey,
          IsTest: this.config.isTest
        })
      }
    });
  }

  private async request<T extends ApiResponse>(config: RequestConfig): Promise<T> {
    try {
      const { endpoint, options = {}, params = {} } = config;
      const url = this.buildUrl(endpoint, params);
      const response = await this.executeFetch(url, options);
      const data = await this.parseResponse<T>(response);

      this.validateResponse(data, response);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildUrl(endpoint: string, params: Record<string, string | number>): URL {
    const url = new URL(`https://${this.config.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return url;
  }

  private async executeFetch(url: URL, options: RequestInit): Promise<Response> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };
    return fetch(url.toString(), { ...options, headers });
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    try {
      return await response.json();
    } catch {
      throw new ExperticketApiError('Failed to parse API response');
    }
  }

  private validateResponse(data: ApiResponse, response: Response): void {
    if (!response.ok || data.Success === false) {
      throw new ExperticketApiError(
        data.ErrorMessage || `API Error: ${response.statusText}`,
        data.ErrorCode
      );
    }
  }

  private handleError(error: unknown): ExperticketApiError {
    if (error instanceof ExperticketApiError) return error;
    return new ExperticketApiError(
      error instanceof Error ? error.message : 'Unknown network error'
    );
  }
}

export default ExperticketService;
