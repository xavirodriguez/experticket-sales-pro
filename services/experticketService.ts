
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
  TransactionDocumentsResponse
} from '../types';

export class ExperticketApiError extends Error {
  constructor(public message: string, public errorCode?: number) {
    super(message);
    this.name = 'ExperticketApiError';
  }
}

class ExperticketService {
  constructor(private readonly config: ExperticketConfig) {}

  private buildUrl(endpoint: string, params: Record<string, string | number> = {}): URL {
    const url = new URL(`https://${this.config.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return url;
  }

  private async performFetch(url: URL, options: RequestInit): Promise<Response> {
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
      return {} as T;
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

  private async request<T extends ApiResponse>(
    endpoint: string,
    options: RequestInit = {},
    params: Record<string, string | number> = {}
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await this.performFetch(url, options);
      const data = await this.parseResponse<T>(response);

      this.validateResponse(data, response);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ExperticketApiError {
    if (error instanceof ExperticketApiError) return error;
    return new ExperticketApiError(
      error instanceof Error ? error.message : 'Unknown network error'
    );
  }

  async getLanguages(): Promise<LanguagesResponse> {
    return this.request<LanguagesResponse>('/AvailableLanguages', {}, {
      PartnerId: this.config.partnerId
    });
  }

  async getProviders(): Promise<ProvidersResponse> {
    return this.request<ProvidersResponse>('/providers', {}, {
      PartnerId: this.config.partnerId,
      LanguageCode: this.config.languageCode
    });
  }

  async getCatalog(): Promise<CatalogResponse> {
    return this.request<CatalogResponse>('/catalog', {}, {
      PartnerId: this.config.partnerId,
      LanguageCode: this.config.languageCode
    });
  }

  async checkCapacity(productIds: string[], dates: string[]): Promise<CapacityResponse> {
    return this.request<CapacityResponse>('/availablecapacity', {}, {
      PartnerId: this.config.partnerId,
      ProductIds: productIds.join(','),
      Dates: dates.join(','),
      IncludePrices: 'true'
    });
  }

  async getRealTimePrices(productIds: string[], startDate: string, endDate: string): Promise<RealTimePriceResponse> {
    return this.request<RealTimePriceResponse>('/RealTimePrices', {
      method: 'POST',
      body: JSON.stringify({
        PartnerId: this.config.partnerId,
        ProductIds: productIds,
        StartDate: startDate,
        EndDate: endDate
      })
    });
  }

  async createReservation(payload: { AccessDateTime: string; Products: { ProductId: string; Quantity: number }[] }): Promise<ReservationResponse> {
    return this.request<ReservationResponse>('/reservation', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        ApiKey: this.config.apiKey,
        IsTest: this.config.isTest
      })
    });
  }

  async createTransaction(reservationId: string, accessDate: string, products: { ProductId: string }[]): Promise<ApiResponse> {
    return this.request<ApiResponse>('/transaction', {
      method: 'POST',
      body: JSON.stringify({
        ApiKey: this.config.apiKey,
        ReservationId: reservationId,
        AccessDateTime: accessDate,
        Products: products,
        IsTest: this.config.isTest
      })
    });
  }

  async getTransactions(params: Record<string, string | number> = {}): Promise<TransactionsResponse> {
    return this.request<TransactionsResponse>('/transaction', {}, {
      ApiKey: this.config.apiKey,
      ...params
    });
  }

  async getCancellationRequests(params: Record<string, string | number> = {}): Promise<CancellationRequestsResponse> {
    return this.request<CancellationRequestsResponse>('/cancellationrequest', {}, {
      ApiKey: this.config.apiKey,
      ...params
    });
  }

  async submitCancellation(saleId: string, reason: number, comments: string = ''): Promise<ApiResponse> {
    return this.request<ApiResponse>('/cancellationrequest', {
      method: 'POST',
      body: JSON.stringify({
        ApiKey: this.config.apiKey,
        SaleId: saleId,
        Reason: reason,
        ReasonComments: comments,
        IsTest: this.config.isTest
      })
    });
  }

  async getTransactionDocuments(id: string): Promise<TransactionDocumentsResponse> {
    return this.request<TransactionDocumentsResponse>('/transactiondocuments', {}, {
      ApiKey: this.config.apiKey,
      id: id,
      IncludeTransactionDocumentsLanguages: 'true'
    });
  }
}

export default ExperticketService;
