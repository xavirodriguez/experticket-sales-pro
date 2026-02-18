
import { ExperticketConfig } from '../types';

class ExperticketService {
  private config: ExperticketConfig;

  constructor(config: ExperticketConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `https://${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.ErrorMessage || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getLanguages() {
    return this.request<any>(`/AvailableLanguages?PartnerId=${this.config.partnerId}`);
  }

  async getProviders() {
    return this.request<any>(`/providers?PartnerId=${this.config.partnerId}&LanguageCode=${this.config.languageCode}`);
  }

  async getCatalog() {
    return this.request<any>(`/catalog?PartnerId=${this.config.partnerId}&LanguageCode=${this.config.languageCode}`);
  }

  async checkCapacity(productIds: string[], dates: string[]) {
    const query = new URLSearchParams({
      PartnerId: this.config.partnerId,
      ProductIds: productIds.join(','),
      Dates: dates.join(','),
      IncludePrices: 'true'
    });
    return this.request<any>(`/availablecapacity?${query.toString()}`);
  }

  async getRealTimePrices(productIds: string[], startDate: string, endDate: string) {
    return this.request<any>(`/RealTimePrices`, {
      method: 'POST',
      body: JSON.stringify({
        PartnerId: this.config.partnerId,
        ProductIds: productIds,
        StartDate: startDate,
        EndDate: endDate
      })
    });
  }

  async createReservation(payload: any) {
    return this.request<any>(`/reservation`, {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        ApiKey: this.config.apiKey,
        IsTest: this.config.isTest
      })
    });
  }

  async createTransaction(reservationId: string, accessDate: string, products: any[]) {
    return this.request<any>(`/transaction`, {
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

  async getTransactions(params: any = {}) {
    const query = new URLSearchParams({
      ApiKey: this.config.apiKey,
      ...params
    });
    return this.request<any>(`/transaction?${query.toString()}`);
  }

  async getCancellationRequests(params: any = {}) {
    const query = new URLSearchParams({
      ApiKey: this.config.apiKey,
      ...params
    });
    return this.request<any>(`/cancellationrequest?${query.toString()}`);
  }

  async submitCancellation(saleId: string, reason: number, comments: string = '') {
    return this.request<any>(`/cancellationrequest`, {
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
}

export default ExperticketService;
