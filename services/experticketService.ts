
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

  private async request<T extends ApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `https://${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || (data.Success === false)) {
        throw new ExperticketApiError(
          data.ErrorMessage || `API Error: ${response.statusText}`,
          data.ErrorCode
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ExperticketApiError) throw error;
      throw new ExperticketApiError(error instanceof Error ? error.message : 'Unknown network error');
    }
  }

  async getLanguages(): Promise<LanguagesResponse> {
    return this.request<LanguagesResponse>(`/AvailableLanguages?PartnerId=${this.config.partnerId}`);
  }

  async getProviders(): Promise<ProvidersResponse> {
    return this.request<ProvidersResponse>(`/providers?PartnerId=${this.config.partnerId}&LanguageCode=${this.config.languageCode}`);
  }

  async getCatalog(): Promise<CatalogResponse> {
    return this.request<CatalogResponse>(`/catalog?PartnerId=${this.config.partnerId}&LanguageCode=${this.config.languageCode}`);
  }

  async checkCapacity(productIds: string[], dates: string[]): Promise<CapacityResponse> {
    const query = new URLSearchParams({
      PartnerId: this.config.partnerId,
      ProductIds: productIds.join(','),
      Dates: dates.join(','),
      IncludePrices: 'true'
    });
    return this.request<CapacityResponse>(`/availablecapacity?${query.toString()}`);
  }

  async getRealTimePrices(productIds: string[], startDate: string, endDate: string): Promise<RealTimePriceResponse> {
    return this.request<RealTimePriceResponse>(`/RealTimePrices`, {
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
    return this.request<ReservationResponse>(`/reservation`, {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        ApiKey: this.config.apiKey,
        IsTest: this.config.isTest
      })
    });
  }

  async createTransaction(reservationId: string, accessDate: string, products: { ProductId: string }[]): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/transaction`, {
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
    const query = new URLSearchParams({
      ApiKey: this.config.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    return this.request<TransactionsResponse>(`/transaction?${query.toString()}`);
  }

  async getCancellationRequests(params: Record<string, string | number> = {}): Promise<CancellationRequestsResponse> {
    const query = new URLSearchParams({
      ApiKey: this.config.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    return this.request<CancellationRequestsResponse>(`/cancellationrequest?${query.toString()}`);
  }

  async submitCancellation(saleId: string, reason: number, comments: string = ''): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/cancellationrequest`, {
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
    const query = new URLSearchParams({
      ApiKey: this.config.apiKey,
      id: id,
      IncludeTransactionDocumentsLanguages: 'true'
    });
    return this.request<TransactionDocumentsResponse>(`/transactiondocuments?${query.toString()}`);
  }
}

export default ExperticketService;
