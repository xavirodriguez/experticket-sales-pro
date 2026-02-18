
export interface ExperticketConfig {
  partnerId: string;
  apiKey: string;
  baseUrl: string;
  languageCode: string;
  isTest: boolean;
}

export interface CatalogItem {
  Providers: Provider[];
  Timestamp: string;
  Success: boolean;
}

export interface Provider {
  Id: string;
  Name: string;
  Description?: string;
}

export interface Product {
  Id: string;
  Name: string;
  Description?: string;
  ProductBaseId: string;
  ProviderId: string;
  Price?: number;
}

export interface Language {
  Code: string;
  EnglishName: string;
  NativeName: string;
}

export interface CapacityResponse {
  ProductBases: any[];
  Products: {
    ProductId: string;
    Date: string;
    AvailableCapacity: number;
    Price?: number;
    PriceMode?: number;
  }[];
  Sessions: {
    SessionId: string;
    Date: string;
    AvailableCapacity: number;
  }[];
  Success: boolean;
}

export interface RealTimePriceResponse {
  ProductsRealTimePrices: {
    ProductId: string;
    AccessDate: string;
    Price: number;
    Success: boolean;
  }[];
  Success: boolean;
}

export interface ReservationRequest {
  ApiKey: string;
  IsTest: boolean;
  AccessDateTime: string;
  Products: {
    ProductId: string;
    Quantity: number;
    Tickets?: any[];
  }[];
  LanguageCode?: string;
}

export interface ReservationResponse {
  ReservationId: string;
  MinutesToExpiry: number;
  TotalPrice: number;
  Success: boolean;
  ErrorMessage?: string;
}

export interface Transaction {
  TransactionId: string;
  AccessDateTime: string;
  TransactionDateTime: string;
  TotalRetailPrice: number;
  Success: boolean;
  Products: any[];
}

export interface CancellationRequest {
  ApiKey: string;
  SaleId: string;
  Reason: number;
  ReasonComments?: string;
  IsTest: boolean;
}

export enum CancellationReason {
  DATE_CHANGE = 1,
  PRODUCT_CHANGE = 2,
  ATTENDEES_CHANGE = 3,
  ILLNESS = 4,
  MISMANAGEMENT = 5,
  INTEGRATION_ISSUES = 6
}
