
export interface ExperticketConfig {
  partnerId: string;
  apiKey: string;
  baseUrl: string;
  languageCode: string;
  isTest: boolean;
}

export interface ApiResponse {
  Success: boolean;
  ErrorMessage?: string;
  ErrorCode?: number;
}

export interface Language {
  Code: string;
  EnglishName: string;
  NativeName: string;
}

export interface LanguagesResponse extends ApiResponse {
  AvailableLanguages: Language[];
}

export interface Provider {
  Id: string;
  Name: string;
  Description?: string;
}

export interface ProvidersResponse extends ApiResponse {
  Providers: Provider[];
}

export interface Product {
  Id: string;
  Name: string;
  Description?: string;
  ProductBaseId: string;
  ProviderId: string;
  Price?: number;
}

export interface ProductBase {
  Id: string;
  Name: string;
  Description?: string;
  ProviderId: string;
  Products: Product[];
}

export interface CatalogResponse extends ApiResponse {
  ProductBases: ProductBase[];
  Timestamp: string;
}

export interface CapacityProduct {
  ProductId: string;
  Date: string;
  AvailableCapacity: number;
  Price?: number;
  PriceMode?: number;
}

export interface CapacitySession {
  SessionId: string;
  Date: string;
  AvailableCapacity: number;
}

export interface CapacityResponse extends ApiResponse {
  ProductBases: any[];
  Products: CapacityProduct[];
  Sessions: CapacitySession[];
}

export interface RealTimePrice {
  ProductId: string;
  AccessDate: string;
  Price: number;
  Success: boolean;
}

export interface RealTimePriceResponse extends ApiResponse {
  ProductsRealTimePrices: RealTimePrice[];
}

export interface ReservationProduct {
  ProductId: string;
  Quantity: number;
  Tickets?: any[];
}

export interface ReservationRequest {
  ApiKey: string;
  IsTest: boolean;
  AccessDateTime: string;
  Products: ReservationProduct[];
  LanguageCode?: string;
}

export interface ReservationResponse extends ApiResponse {
  ReservationId: string;
  MinutesToExpiry: number;
  TotalPrice: number;
}

export interface TransactionProduct {
  ProductId: string;
  ProductName: string;
  ProviderId: string;
  ProviderName: string;
  Quantity: number;
  UnitPrice: number;
  TotalRetailPrice: number;
}

export interface Transaction {
  TransactionId: string;
  AccessDateTime: string;
  TransactionDateTime: string;
  TotalRetailPrice: number;
  TotalPrice?: number;
  Success: boolean;
  Products: TransactionProduct[];
}

export interface TransactionsResponse extends ApiResponse {
  Transactions: Transaction[];
  TotalCount: number;
}

export interface CancellationRequest {
  CancellationRequestId: string;
  SaleId: string;
  Reason: number;
  ReasonComments?: string;
  Status: number;
  StatusComments?: string;
  CreatedDateTime: string;
  IsTest: boolean;
}

export interface CancellationRequestsResponse extends ApiResponse {
  CancellationRequests: CancellationRequest[];
  TotalCount: number;
}

export interface TransactionDocument {
  LanguageCode: string;
  SalesDocumentUrl: string;
}

export interface TransactionDocumentsResponse extends ApiResponse {
  Documents: TransactionDocument[];
}

export enum CancellationReason {
  DATE_CHANGE = 1,
  PRODUCT_CHANGE = 2,
  ATTENDEES_CHANGE = 3,
  ILLNESS = 4,
  MISMANAGEMENT = 5,
  INTEGRATION_ISSUES = 6
}
