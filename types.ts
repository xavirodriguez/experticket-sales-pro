/**
 * Configuration settings for the Experticket API client.
 *
 * @remarks
 * This configuration is typically persisted in local storage and used to
 * initialize the service layer.
 */
export interface ExperticketConfig {
  /** The unique identifier for the partner assigned by Experticket. */
  partnerId: string;
  /**
   * The secret API key for authentication.
   * @remarks This should be kept secure and handled with care in client-side applications.
   */
  apiKey: string;
  /** The base URL of the Experticket API (e.g., 'api.experticket.com'). */
  baseUrl: string;
  /**
   * The ISO 639-1 language code for localized content.
   * @defaultValue 'en'
   */
  languageCode: string;
  /** Whether to use the sandbox environment for transactions. */
  isTest: boolean;
}

/**
 * Common structure for all Experticket API responses.
 *
 * @remarks
 * Every response from the Experticket API inherits from this interface to provide
 * standardized error handling.
 */
export interface ApiResponse {
  /** Indicates if the request was processed successfully. */
  Success: boolean;
  /** Human-readable error message if the request failed. */
  ErrorMessage?: string;
  /** Numeric error code representing the specific failure reason. */
  ErrorCode?: number;
}

/**
 * Represents a supported language in the system.
 */
export interface Language {
  /** The ISO 639-1 code (e.g., 'en', 'es'). */
  Code: string;
  /** The name of the language in English. */
  EnglishName: string;
  /** The name of the language in its native form. */
  NativeName: string;
}

/**
 * Response containing a list of available languages.
 */
export interface LanguagesResponse extends ApiResponse {
  /** Array of supported languages. */
  AvailableLanguages: Language[];
}

/**
 * Represents a ticket provider.
 *
 * @remarks
 * Providers are entities that offer products through the Experticket platform.
 */
export interface Provider {
  /** Unique identifier for the provider. */
  Id: string;
  /** Display name of the provider. */
  Name: string;
  /** Optional summary of the provider's services. */
  Description?: string;
}

/**
 * Response containing a list of ticket providers.
 */
export interface ProvidersResponse extends ApiResponse {
  /** Array of active providers. */
  Providers: Provider[];
}

/**
 * Represents an individual ticketable product.
 *
 * @remarks
 * Products are grouped under product bases and belong to a specific provider.
 */
export interface Product {
  /** Unique identifier for the product. */
  Id: string;
  /** Display name of the product. */
  Name: string;
  /** Detailed description of what the product includes. */
  Description?: string;
  /** The identifier of the parent product base. */
  ProductBaseId: string;
  /** The identifier of the provider offering this product. */
  ProviderId: string;
  /**
   * The retail price of the product.
   * @remarks This may be null if prices are not included in the catalog request.
   */
  Price?: number;
}

/**
 * Groups related products under a single base entity.
 */
export interface ProductBase {
  /** Unique identifier for the product base. */
  Id: string;
  /** Name of the product base group. */
  Name: string;
  /** General description for the group of products. */
  Description?: string;
  /** The identifier of the provider. */
  ProviderId: string;
  /** Array of products belonging to this base. */
  Products: Product[];
}

/**
 * Response containing the full product catalog.
 */
export interface CatalogResponse extends ApiResponse {
  /** Array of product bases and their associated products. */
  ProductBases: ProductBase[];
  /** The time when this catalog was last updated. */
  Timestamp: string;
}

/**
 * Availability information for a specific product on a given date.
 */
export interface CapacityProduct {
  /** The unique product identifier. */
  ProductId: string;
  /** The date of access in YYYY-MM-DD format. */
  Date: string;
  /** Remaining number of tickets available for purchase. */
  AvailableCapacity: number;
  /** Current price for this specific date, if applicable. */
  Price?: number;
  /**
   * Price mode indicator.
   * @remarks 0 for fixed, 1 for variable.
   */
  PriceMode?: number;
}

/**
 * Availability information for a specific time session.
 */
export interface CapacitySession {
  /** Unique identifier for the session. */
  SessionId: string;
  /** The date of the session in YYYY-MM-DD format. */
  Date: string;
  /** Remaining capacity within this specific session. */
  AvailableCapacity: number;
}

/**
 * Response containing capacity and availability data.
 */
export interface CapacityResponse extends ApiResponse {
  /**
   * Product base availability summaries.
   * @internal Use {@link CapacityResponse.Products} for specific product checks.
   */
  ProductBases: unknown[];
  /** Detailed availability for individual products. */
  Products: CapacityProduct[];
  /** Detailed availability for specific timed sessions. */
  Sessions: CapacitySession[];
}

/**
 * Parameters for searching real-time product pricing.
 */
export interface RealTimePriceSearchParams {
  /** List of product IDs to query. */
  productIds: string[];
  /** The start of the date range in YYYY-MM-DD format. */
  startDate: string;
  /** The end of the date range in YYYY-MM-DD format. */
  endDate: string;
}

/**
 * Price information for a product on a specific date.
 */
export interface RealTimePrice {
  /** The product identifier. */
  ProductId: string;
  /** The access date in YYYY-MM-DD format. */
  AccessDate: string;
  /** The current retail price. */
  Price: number;
  /** Whether the price was successfully retrieved. */
  Success: boolean;
}

/**
 * Response containing real-time pricing for multiple products.
 */
export interface RealTimePriceResponse extends ApiResponse {
  /** Array of price entries for the requested products and dates. */
  ProductsRealTimePrices: RealTimePrice[];
}

/**
 * Represents a product included in a reservation.
 */
export interface ReservationProduct {
  /** The product identifier. */
  ProductId: string;
  /** The number of tickets to reserve. */
  Quantity: number;
  /**
   * Additional ticket-level metadata.
   * @internal
   */
  Tickets?: unknown[];
}

/**
 * Parameters for creating a new reservation.
 */
export interface ReservationCreationParams {
  /** The intended date and time of access (YYYY-MM-DD or ISO 8601). */
  accessDateTime: string;
  /** List of products and quantities to reserve. */
  products: ReservationProduct[];
}

/**
 * Request payload for creating a new reservation.
 * @internal
 */
export interface ReservationRequest {
  /** API key for authentication. */
  ApiKey: string;
  /** Whether this is a test reservation. */
  IsTest: boolean;
  /** The intended date and time of access. */
  AccessDateTime: string;
  /** List of products and quantities to reserve. */
  Products: ReservationProduct[];
  /** Preferred language for reservation documents. */
  LanguageCode?: string;
}

/**
 * Response containing details of a created reservation.
 *
 * @remarks
 * A reservation holds capacity for a limited time until it is confirmed by a transaction.
 */
export interface ReservationResponse extends ApiResponse {
  /** Unique identifier for the reservation. */
  ReservationId: string;
  /** Number of minutes until the reservation expires if not confirmed. */
  MinutesToExpiry: number;
  /** Total calculated price for all products in the reservation. */
  TotalPrice: number;
}

/**
 * Parameters for finalizing a transaction from a reservation.
 */
export interface TransactionCreationParams {
  /** The identifier of the active reservation. */
  reservationId: string;
  /** The confirmed date and time of access in YYYY-MM-DD format. */
  accessDate: string;
  /** List of products to include in the final transaction. */
  products: { ProductId: string }[];
}

/**
 * Details of a product within a processed transaction.
 */
export interface TransactionProduct {
  /** The product identifier. */
  ProductId: string;
  /** The name of the product at the time of sale. */
  ProductName: string;
  /** The provider's unique identifier. */
  ProviderId: string;
  /** The name of the provider. */
  ProviderName: string;
  /** Number of tickets purchased. */
  Quantity: number;
  /** Price per single unit. */
  UnitPrice: number;
  /** Total price for this product line (Quantity * UnitPrice). */
  TotalRetailPrice: number;
}

/**
 * Represents a completed sales transaction.
 */
export interface Transaction {
  /** Unique identifier for the transaction/sale. */
  TransactionId: string;
  /** The scheduled date and time of access. */
  AccessDateTime: string;
  /** The timestamp when the transaction was finalized. */
  TransactionDateTime: string;
  /** The total amount paid by the customer. */
  TotalRetailPrice: number;
  /**
   * The total net price.
   * @remarks This may differ from {@link Transaction.TotalRetailPrice} if commissions are applied.
   */
  TotalPrice?: number;
  /** Indicates if the transaction is currently valid. */
  Success: boolean;
  /** Array of items purchased in this transaction. */
  Products: TransactionProduct[];
}

/**
 * Parameters for searching transactions.
 */
export interface TransactionSearchParams {
  /**
   * The number of records to return per page.
   * @defaultValue 50
   */
  PageSize?: number;
  /**
   * The page number to retrieve.
   * @defaultValue 1
   */
  Page?: number;
  /** Filter by transaction identifier. */
  TransactionId?: string;
  /** Filter by provider identifier. */
  ProviderId?: string;
}

/**
 * Response containing a list of transactions.
 */
export interface TransactionsResponse extends ApiResponse {
  /** Array of transactions matching the search criteria. */
  Transactions: Transaction[];
  /** Total number of records available in the system. */
  TotalCount: number;
}

/**
 * Parameters for searching cancellation requests.
 */
export interface CancellationSearchParams {
  /**
   * The number of records to return per page.
   * @defaultValue 50
   */
  PageSize?: number;
  /**
   * The page number to retrieve.
   * @defaultValue 1
   */
  Page?: number;
  /** Filter by cancellation status. */
  Status?: number;
  /** Filter by sale identifier. */
  SaleId?: string;
}

/**
 * Parameters for submitting a new cancellation request.
 */
export interface CancellationSubmissionParams {
  /** The identifier of the transaction to cancel. */
  saleId: string;
  /** The reason code for the cancellation. */
  reason: number;
  /** Additional context or explanation for the request. */
  comments?: string;
}

/**
 * Represents a request to cancel an existing transaction.
 */
export interface CancellationRequest {
  /** Unique identifier for the cancellation request. */
  CancellationRequestId: string;
  /** The identifier of the sale being cancelled. */
  SaleId: string;
  /** The numeric reason code (see {@link CancellationReason}). */
  Reason: number;
  /** Human-readable comments provided by the agent. */
  ReasonComments?: string;
  /**
   * The current status of the request.
   * @remarks 0: Pending, 1: Approved, 2: Rejected.
   */
  Status: number;
  /** Feedback or explanation from the processing system. */
  StatusComments?: string;
  /** When the request was created in ISO 8601 format. */
  CreatedDateTime: string;
  /** Whether this request was made in test mode. */
  IsTest: boolean;
}

/**
 * Response containing a list of cancellation requests.
 */
export interface CancellationRequestsResponse extends ApiResponse {
  /** Array of cancellation requests matching the search criteria. */
  CancellationRequests: CancellationRequest[];
  /** Total number of records available in the system. */
  TotalCount: number;
}

/**
 * Link to a downloadable document (e.g., PDF ticket) for a transaction.
 */
export interface TransactionDocument {
  /** The language of the document. */
  LanguageCode: string;
  /** The absolute URL where the document can be accessed. */
  SalesDocumentUrl: string;
}

/**
 * Response containing document links for a transaction.
 */
export interface TransactionDocumentsResponse extends ApiResponse {
  /** Array of available documents in various languages. */
  Documents: TransactionDocument[];
}

/**
 * Standard reason codes for transaction cancellations.
 */
export enum CancellationReason {
  /** The customer requested a different date. */
  DATE_CHANGE = 1,
  /** The customer requested a different product. */
  PRODUCT_CHANGE = 2,
  /** Change in the number of attendees. */
  ATTENDEES_CHANGE = 3,
  /** Personal illness or medical emergency. */
  ILLNESS = 4,
  /** Error in booking management or processing. */
  MISMANAGEMENT = 5,
  /** Technical integration or API issues. */
  INTEGRATION_ISSUES = 6
}

/**
 * State contract for the New Sale Wizard flow.
 *
 * @remarks
 * This interface tracks the user's progress through the multi-step booking process,
 * from product selection to final transaction confirmation.
 */
export interface SaleWizardState {
  /** The current step in the wizard (1-4). */
  step: number;
  /** The identifier of the selected provider. */
  selectedProviderId: string;
  /** The identifier of the selected product. */
  selectedProductId: string;
  /** The selected date of access in YYYY-MM-DD format. */
  accessDate: string;
  /** The number of tickets to purchase. */
  quantity: number;
  /** The identifier of the active reservation, if created. */
  reservationId: string;
  /** The final transaction identifier after successful purchase. */
  transactionId: string;
  /** The time remaining in minutes before the reservation expires. */
  reservationExpiry: number;
}
