# Experticket Sales Pro — Internal Architecture Deep Dive

## Architecture Overview

```mermaid
graph TD
  "index.tsx" --> "App.tsx"
  "App.tsx" --> "useConfig"
  "App.tsx" --> "HashRouter"
  "HashRouter" --> "Sidebar"
  "HashRouter" --> "Header"
  "HashRouter" --> "Routes"
  "Routes" --> "DashboardView"
  "Routes" --> "NewSaleWizard"
  "Routes" --> "TransactionManager"
  "Routes" --> "DocumentsPanel"
  "Routes" --> "CancellationManager"
  "Routes" --> "Settings"
  "Header" --> "Assistant"
  "Assistant" --> "useAssistant"
  "useAssistant" --> "AiService"
  "AiService" --> "Gemini REST API"
  "NewSaleWizard" --> "useNewSaleWizard"
  "useNewSaleWizard" --> "useWizardData"
  "useNewSaleWizard" --> "useWizardActions"
  "useNewSaleWizard" --> "useWizardNavigation"
  "useWizardData" --> "ExperticketService"
  "useWizardActions" --> "ExperticketService"
  "ExperticketService" --> "Experticket REST API"
```

---

## 1. How the Main `App` Component Orchestrates Routing and State Management

`App.tsx` is the root component. It is the **single owner of global configuration state**, which it obtains exclusively from `useConfig`. It uses **`HashRouter`** from `react-router-dom` to enable client-side routing without server configuration, and it manages the mobile sidebar toggle state (`isSidebarOpen`) with a simple `useState` + `useCallback` pattern. [1](#1-0) 

The `config` object is passed as a **prop** to every route-level page component (`DashboardView`, `NewSaleWizard`, `TransactionManager`, `DocumentsPanel`, `CancellationManager`). The `Settings` route receives both `config` and the `updateConfig` callback, making it the only page that can mutate global configuration. [2](#1-1) 

A `MobileBackdrop` overlay component is conditionally rendered when the sidebar is open on mobile, providing a click-to-close mechanism. [3](#1-2) 

---

## 2. How the Custom Hooks Manage State and Side Effects

### `useConfig`

This hook is the **single source of truth for API credentials**. It initializes state by reading from `localStorage` via `loadStoredConfig`, and a `useEffect` automatically persists `partnerId`, `baseUrl`, and `isTest` back to `localStorage` whenever the config state changes. [4](#1-3) [5](#1-4) 

**Security note**: The `apiKey` is intentionally **never stored in `localStorage`** to mitigate XSS risks. It lives only in React's in-memory state. [6](#1-5) 

### `useNewSaleWizard`

This is the most complex hook, acting as an orchestrator for three sub-hooks. It owns the `SaleWizardState`, `loading`, and `error` state. It instantiates `ExperticketService` via `useMemo` so the service is only re-created when `config` changes. [7](#1-6) 

The central `executeAction` wrapper is the **unified error and loading handler** — any async action in the wizard runs through it: [8](#1-7) 

Products are filtered client-side via `useMemo` based on `selectedProviderId`: [9](#1-8) 

### `useTransactions`

It triggers a fetch on mount (and whenever `config.apiKey` or `experticketService` changes) via `useEffect`. It returns **memoized filtered transactions** based on a `searchTerm` that filters by `TransactionId` or `ProductName`: [10](#1-9) 

Note that if `config.apiKey` is absent, the fetch is **silently skipped** (no error thrown): [11](#1-10) 

### `useAssistant`

Maintains **two parallel histories**: a display-friendly `AssistantMessage[]` (with `role: 'user' | 'bot'`) and a Gemini-native `GeminiMessage[]` (with `role: 'user' | 'model'`) used for the actual API call. When a user sends a message, both histories are updated and `processAiResponse` is called with the full Gemini history. [12](#1-11) 

---

## 3. How `ExperticketService` and `AiService` Communicate with External APIs

### `ExperticketService`

This is a **class-based service** that wraps the native `fetch` API. Every public method routes through two private methods:

- `buildUrl`: Constructs a full `https://` URL from `this.config.baseUrl` + endpoint + query params.
- `executeFetch`: Injects `Accept` and `Content-Type` headers and conditionally adds `X-Api-Key` header. [13](#1-12) 

All requests flow through the private `request<T>` method which chains `buildUrl` → `executeFetch` → `parseResponse` → `validateResponse`: [14](#1-13) 

POST requests are made via the private `post<T>` helper which **automatically injects `IsTest`** from config into the body: [15](#1-14) 

GET requests that require auth (e.g., `getTransactions`, `getCancellationRequests`, `getTransactionDocuments`) pass `apiKey` explicitly, while catalog/provider lookups do not: [16](#1-15) 

### `AiService`

This is a **plain object** (not a class) that calls the **Gemini REST API** directly without any SDK. It posts the full conversation history plus a `system_instruction` to the `gemini-1.5-flash` model endpoint: [17](#1-16) 

The API key is retrieved at call time from environment variables (`VITE_AI_API_KEY`, `AI_API_KEY`, or `API_KEY`): [18](#1-17) 

The response is parsed through `extractTextFromResponse`, which traverses `candidates[0].content.parts[0].text`: [19](#1-18) 

---

## 4. How Data Flows Between Components Through Props and Hooks

The data flow follows a strict **top-down prop pattern** for `config`, and a **hook-encapsulates-state** pattern for everything else:

```mermaid
graph TD
  "App (useConfig)" -- "config prop" --> "NewSaleWizard"
  "App (useConfig)" -- "config prop" --> "TransactionManager"
  "App (useConfig)" -- "config prop" --> "DashboardView"
  "App (useConfig)" -- "config, onUpdate props" --> "Settings"
  "NewSaleWizard" -- "useNewSaleWizard(config)" --> "useWizardData"
  "NewSaleWizard" -- "useNewSaleWizard(config)" --> "useWizardActions"
  "NewSaleWizard" -- "props: state, updateState, providers, filteredProducts" --> "WizardStepRenderer"
  "WizardStepRenderer" -- "props" --> "ProductSelectionStep"
  "WizardStepRenderer" -- "props" --> "CapacityCheckStep"
  "ProductSelectionStep" -- "onUpdate callback" --> "useNewSaleWizard state"
  "TransactionManager" -- "useTransactions(config)" --> "ExperticketService"
  "TransactionManager" -- "props: transactions, loading" --> "TransactionTable"
  "TransactionManager" -- "props: searchTerm, onSearchChange" --> "TransactionFilters"
```

The `Settings` component uses **local state** (`localConfig`) as a staging area before committing via `onUpdate`: [20](#1-19) 

---

## 5. How `NewSaleWizard` Manages Multi-Step State Transitions

The wizard has **4 steps** tracked by `SaleWizardState.step`. Step transitions are driven by the `stepActions` map in `useNewSaleWizard`, which maps step numbers to async action functions: [21](#1-20) 

The navigation is then handled by `useWizardNavigation`, which looks up and executes the action for `state.step`: [22](#1-21) 

Each action in `useWizardActions` calls the API and then mutates `step` forward on success:

- **Step 1 → 2** (`handleProductSelection`): Validates product selection, calls `checkCapacity`, stores result, sets `step: 2`. [23](#1-22) 

- **Step 2 → 3** (`handleReservation`): Calls `createReservation`, stores `reservationId` and `reservationExpiry`, sets `step: 3`. [24](#1-23) 

- **Step 3 → 4** (`handleTransaction`): Calls `createTransaction`, stores `transactionId`, sets `step: 4`. [25](#1-24) 

`WizardStepRenderer` uses a `stepComponents` dictionary to declaratively map step number to the correct React element: [26](#1-25) 

The `WizardNavigation` hides itself entirely when `step === 4` (confirmed), and the "Continue" button label changes to "Complete Sale" on step 3: [27](#1-26) [28](#1-27) 

The `ReservationStep` runs a client-side **countdown timer** using `setInterval` via `useRef` to show how long the reservation is valid, with urgency states: [29](#1-28) 

---

## 6. How Configuration Is Stored and Retrieved

The configuration lifecycle is:

1. **On mount**: `loadStoredConfig` reads `partnerId`, `baseUrl`, and `isTest` from `localStorage`. `apiKey` always starts as `''`. [4](#1-3) 

2. **On any change**: A `useEffect` persists the non-sensitive fields back to `localStorage` using fixed key constants defined in `STORAGE_KEYS`. [30](#1-29) [31](#1-30) 

3. **`isTest` defaults to `true`** unless explicitly set to `'false'` in storage — a fail-safe to prevent accidental production transactions. [32](#1-31) 

4. **Settings UI**: The `Settings` component holds a `localConfig` copy. Only when the user clicks "Save" does it call `onUpdate(localConfig)`, which triggers `useConfig`'s `setConfig` and thus the storage `useEffect`. [33](#1-32) 

---

## 7. How the AI Assistant Integrates with the Gemini API

The assistant maintains a **stateful conversation** through a dual-history mechanism. The `GeminiMessage` format (with `role: 'model'`) is kept separate from the display format (`role: 'bot'`): [34](#1-33) [35](#1-34) 

Each call to `AiService.fetchResponse` sends the **entire conversation history** plus a hardcoded system instruction that scopes the bot to Experticket-specific knowledge: [36](#1-35) [37](#1-36) 

The bot's response is appended to **both** the display history (as `role: 'bot'`) and the Gemini history (as `role: 'model'`) to maintain context: [38](#1-37) 

The `Assistant` component in `Header` manages its own open/closed UI state and the current input text, delegating all business logic to `useAssistant`: [39](#1-38) 

---

## 8. Key Interfaces and Types

All types are defined in a single `types.ts` file. The key structures are:

**`ExperticketConfig`** — The root configuration shared across the entire app: [40](#1-39) 

**`ApiResponse`** — The base type extended by all API responses, providing standardized `Success`, `ErrorMessage`, and `ErrorCode` fields: [41](#1-40) 

**`SaleWizardState`** — The complete state contract for the 4-step wizard, tracking step, selection IDs, dates, quantities, and IDs returned by the API: [42](#1-41) 

**`Transaction` and `TransactionProduct`** — Represent finalized sales data: [43](#1-42) 

**`CancellationReason`** — An enum providing type-safe reason codes for cancellations: [44](#1-43) 

**`CapacityProduct`** — Carries availability and pricing data used in Step 2 of the wizard: [45](#1-44) 

---

## 9. How Error Handling and Validation Work

### Service Layer

The `ExperticketService` defines a custom `ExperticketApiError` class that captures the API's `ErrorCode`: [46](#1-45) 

`validateResponse` checks **both** the HTTP status (`response.ok`) and the application-level `Success` flag in the JSON body, throwing on either failure: [47](#1-46) 

`handleError` normalizes **any** thrown value into an `ExperticketApiError`, ensuring a consistent error type bubbles up: [48](#1-47) 

### Wizard Layer

The `executeAction` wrapper in `useNewSaleWizard` catches all errors from wizard actions and places them into the `error` string state (displayed by `WizardErrorMessage`): [8](#1-7) 

Step 1 validation is done at the action level — `handleProductSelection` throws synchronously if no product is selected: [49](#1-48) 

A **capacity block** is also enforced: if `AvailableCapacity === 0`, the "Continue" button in `WizardNavigation` is disabled: [50](#1-49) [51](#1-50) 

### Component Layer

`CancellationForm` has its own local `error` state and re-throws errors from `submitCancellation` to display them inline: [52](#1-51) 

`useTransactions` and `useCancellations` silently guard against missing `apiKey` to avoid unnecessary API calls: [53](#1-52) 

### AI Layer

`AiService` throws a descriptive error if no API key is found in the environment: [18](#1-17) 

`useAssistant` catches AI errors and appends the error message directly into the chat as a bot message, so the UI never breaks: [54](#1-53) 

---

## 10. How Layout Components (`Sidebar`, `Header`) Interact with the Main Application State

### `Sidebar`

Receives exactly **three props** from `App`: `isOpen` (controls CSS translate for mobile slide-in), `isTest` (passed down from `config`), and `onClose` (called when a `NavLink` is clicked to auto-close the sidebar on mobile): [55](#1-54) [56](#1-55) 

The `TestModeIndicator` sub-component visually reflects `isTest` with an orange/green color indicator, providing a persistent at-a-glance environment warning: [57](#1-56) 

Navigation uses `NavLink` from `react-router-dom`, which auto-applies active styling based on the current route. [58](#1-57) 

### `Header`

Receives only `onMenuClick` from `App` (the `toggleSidebar` callback) and mounts the `Assistant` component directly — making the AI chat **globally available** regardless of the current route: [59](#1-58) 

The `Header` has **no dependency on `config`**, which means it is isolated from API credential state and will always render correctly even before the user sets up their credentials.

---

## Notes

- The application uses **`HashRouter`** (not `BrowserRouter`), making it deployable as a static file without server-side routing configuration.
- `ExperticketService` is instantiated inside every consuming hook (not as a singleton), via `useMemo`, meaning a new service instance is created only when `config` changes — a clean approach that avoids stale closures.
- The project tech stack (from `package.json`) is: **React 19**, **React Router v7**, **Vite**, **TypeScript**, **Tailwind CSS** (via CDN in `index.html`), **Lucide React** for icons, and **Vitest** + **Testing Library** for testing. [60](#1-59) 
- The AI assistant's `conversationHistory` is held in React state, meaning the full chat history is **lost on page refresh** — it is not persisted anywhere.
- Some dashboard metrics (`reservations`, `catalogItems`) are hardcoded as `'--'` with TODO comments, indicating incomplete features. [61](#1-60)

### Citations

**File:** App.tsx (L13-50)
```typescript
const App: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {isSidebarOpen && <MobileBackdrop onClick={closeSidebar} />}

        <Sidebar
          isOpen={isSidebarOpen}
          isTest={config.isTest}
          onClose={closeSidebar}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={toggleSidebar} />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<DashboardView config={config} />} />
                <Route path="/new-sale" element={<NewSaleWizard config={config} />} />
                <Route path="/transactions" element={<TransactionManager config={config} />} />
                <Route path="/documents" element={<DocumentsPanel config={config} />} />
                <Route path="/cancellations" element={<CancellationManager config={config} />} />
                <Route path="/settings" element={<Settings config={config} onUpdate={updateConfig} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};
```

**File:** App.tsx (L52-57)
```typescript
const MobileBackdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
    onClick={onClick}
  />
);
```

**File:** hooks/useConfig.ts (L8-29)
```typescript
const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  BASE_URL: 'baseUrl',
  IS_TEST: 'isTest'
};

/**
 * Retrieves the initial configuration from localStorage or defaults.
 *
 * @remarks
 * The API key is intentionally not retrieved from localStorage to prevent XSS exposure.
 *
 * @returns The stored configuration or a default one.
 * @internal
 */
const loadStoredConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: '', // API key is never persisted for security reasons
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: localStorage.getItem(STORAGE_KEYS.IS_TEST) !== 'false' // default to true
});
```

**File:** hooks/useConfig.ts (L57-75)
```typescript
export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(loadStoredConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER_ID, config.partnerId);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
    localStorage.setItem(STORAGE_KEYS.IS_TEST, String(config.isTest));
  }, [config]);

  /**
   * Updates the current configuration with new values.
   *
   * @param newConfig - The new configuration settings object.
   */
  const updateConfig = useCallback((newConfig: ExperticketConfig) => {
    setConfig(newConfig);
  }, []);

  return { config, updateConfig };
```

**File:** hooks/useNewSaleWizard.ts (L51-97)
```typescript
export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Updates specific fields of the wizard state.
   * @param updates - Partial state updates.
   */
  const updateState = useCallback((updates: Partial<SaleWizardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Executes a wizard action with loading and error handling.
   * @internal
   * @param action - The async action to perform.
   */
  const executeAction = useCallback(async (action: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await action();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const { providers, catalog } = useWizardData({ experticketService, onExecuteAction: executeAction });
  const { capacityInfo, handleProductSelection, handleReservation, handleTransaction } = useWizardActions({ experticketService, state, updateState });

  const stepActions = useMemo(() => ({
    1: handleProductSelection,
    2: handleReservation,
    3: handleTransaction
  }), [handleProductSelection, handleReservation, handleTransaction]);

  const { goToNextStep, goToPreviousStep } = useWizardNavigation({ state, updateState, actions: stepActions, executeAction });

  const filteredProducts = useMemo((): Product[] => {
    const products = catalog?.ProductBases?.flatMap(pb => pb.Products || []) || [];
    return products.filter(p => p.ProviderId === state.selectedProviderId);
  }, [catalog, state.selectedProviderId]);
```

**File:** hooks/useTransactions.ts (L39-68)
```typescript
  const fetchTransactions = useCallback(async () => {
    if (!config.apiKey) return;

    try {
      setLoading(true);
      const response = await experticketService.getTransactions({ PageSize: 50 });
      setTransactions(response.Transactions || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      console.error(errorMessage, error);
    } finally {
      setLoading(false);
    }
  }, [experticketService, config.apiKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Memoized list of transactions filtered by the search term.
   * @internal
   */
  const filteredTransactions = useMemo(() => {
    const searchToken = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.TransactionId.toLowerCase().includes(searchToken) ||
      transaction.Products?.some(product => product.ProductName?.toLowerCase().includes(searchToken))
    );
  }, [transactions, searchTerm]);
```

**File:** hooks/useAssistant.ts (L7-12)
```typescript
export interface AssistantMessage {
  /** The sender of the message. */
  role: 'user' | 'bot';
  /** The message text content. */
  text: string;
}
```

**File:** hooks/useAssistant.ts (L48-97)
```typescript
export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Processes the AI response and updates the state.
   * @internal
   */
  const processAiResponse = useCallback(async (currentHistory: GeminiMessage[]) => {
    try {
      const response = await AiService.fetchResponse(currentHistory);
      const text = response || "I'm sorry, I couldn't generate a response.";

      setMessages(prev => [...prev, { role: 'bot', text }]);
      setConversationHistory(prev => [...prev, {
        role: 'model',
        parts: [{ text }]
      }]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error connecting to AI service.";
      setMessages(prev => [...prev, { role: 'bot', text: message }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sends a user prompt to the AI service and updates the chat history.
   *
   * @param userPrompt - The message text from the user.
   */
  const sendMessage = useCallback(async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const newUserMessage: GeminiMessage = {
      role: 'user',
      parts: [{ text: userPrompt }]
    };

    const updatedHistory = [...conversationHistory, newUserMessage];

    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setConversationHistory(updatedHistory);
    setIsLoading(true);

    await processAiResponse(updatedHistory);
  }, [conversationHistory, processAiResponse]);

  return { messages, isLoading, sendMessage };
```

**File:** services/experticketService.ts (L35-45)
```typescript
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
```

**File:** services/experticketService.ts (L247-255)
```typescript
  async getTransactions(searchParams: TransactionSearchParams = {}): Promise<TransactionsResponse> {
    return this.request<TransactionsResponse>({
      endpoint: '/transaction',
      apiKey: this.config.apiKey,
      params: {
        ...(searchParams as Record<string, string | number>)
      }
    });
  }
```

**File:** services/experticketService.ts (L333-345)
```typescript
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
```

**File:** services/experticketService.ts (L353-365)
```typescript
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
```

**File:** services/experticketService.ts (L374-401)
```typescript
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
```

**File:** services/experticketService.ts (L426-433)
```typescript
  private validateResponse(data: ApiResponse, response: Response): void {
    if (!response.ok || data.Success === false) {
      throw new ExperticketApiError(
        data.ErrorMessage || `API Error: ${response.statusText}`,
        data.ErrorCode
      );
    }
  }
```

**File:** services/experticketService.ts (L441-446)
```typescript
  private handleError(error: unknown): ExperticketApiError {
    if (error instanceof ExperticketApiError) return error;
    return new ExperticketApiError(
      error instanceof Error ? error.message : 'Unknown network error'
    );
  }
```

**File:** services/aiService.ts (L5-5)
```typescript
const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";
```

**File:** services/aiService.ts (L10-15)
```typescript
export interface GeminiMessage {
  /** The role of the message sender. */
  role: 'user' | 'model';
  /** The content parts of the message. */
  parts: { text: string }[];
}
```

**File:** services/aiService.ts (L40-65)
```typescript
  async fetchResponse(history: GeminiMessage[]): Promise<string> {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: history,
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `AI service request failed with status ${response.status}`);
    }

    const data = await response.json();
    return extractTextFromResponse(data);
  }
};
```

**File:** services/aiService.ts (L74-88)
```typescript
function extractTextFromResponse(data: unknown): string {
  const response = data as {
    candidates?: {
      content?: {
        parts?: { text?: string }[];
      };
    }[];
  };

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid response format from AI service");
  }
  return text;
}
```

**File:** services/aiService.ts (L96-106)
```typescript
function getApiKey(): string {
  const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env;
  const apiKey = metaEnv?.VITE_AI_API_KEY ||
                 (process.env as Record<string, string | undefined>)?.AI_API_KEY ||
                 (process.env as Record<string, string | undefined>)?.API_KEY;

  if (!apiKey) {
    throw new Error("AI API Key is not configured in environment variables");
  }
  return apiKey;
}
```

**File:** components/Settings.tsx (L34-50)
```typescript
const Settings: React.FC<SettingsProps> = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);

  /**
   * Persists the local configuration changes.
   * @internal
   */
  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => {
      onUpdate(localConfig);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }, 600);
  };
```

**File:** hooks/useWizardNavigation.ts (L39-42)
```typescript
  const goToNextStep = useCallback(() => executeAction(async () => {
    const action = actions[state.step];
    if (action) await action();
  }), [state.step, executeAction, actions]);
```

**File:** hooks/useWizardActions.ts (L36-42)
```typescript
  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await experticketService.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    updateState({ step: 2 });
  }, [experticketService, state.selectedProductId, state.accessDate, updateState]);
```

**File:** hooks/useWizardActions.ts (L45-55)
```typescript
  const handleReservation = useCallback(async () => {
    const response = await experticketService.createReservation({
      accessDateTime: state.accessDate,
      products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    updateState({
      step: 3,
      reservationId: response.ReservationId,
      reservationExpiry: response.MinutesToExpiry
    });
  }, [experticketService, state.accessDate, state.selectedProductId, state.quantity, updateState]);
```

**File:** hooks/useWizardActions.ts (L58-72)
```typescript
  const handleTransaction = useCallback(async () => {
    const response = await experticketService.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });

    // ApiResponse might have TransactionId if it's a specific implementation
    const transactionId = response.TransactionId || state.reservationId;

    updateState({
      step: 4,
      transactionId
    });
  }, [experticketService, state.reservationId, state.accessDate, state.selectedProductId, updateState]);
```

**File:** components/wizard/WizardStepRenderer.tsx (L49-77)
```typescript
  const stepComponents: Record<number, React.ReactElement> = {
    1: (
      <ProductSelectionStep
        providers={providers}
        products={filteredProducts}
        selectedProviderId={state.selectedProviderId}
        selectedProductId={state.selectedProductId}
        accessDate={state.accessDate}
        quantity={state.quantity}
        onUpdate={updateState}
      />
    ),
    2: <CapacityCheckStep capacityInfo={capacityInfo} />,
    3: (
      <ReservationStep
        reservationId={state.reservationId}
        reservationExpiry={state.reservationExpiry}
      />
    ),
    4: (
      <SaleConfirmationStep
        onNewBooking={resetWizard}
        onViewTransactions={onViewTransactions}
        transactionId={state.transactionId}
      />
    )
  };

  return stepComponents[step] || <></>;
```

**File:** components/NewSaleWizard.tsx (L51-53)
```typescript
  const isCapacityBlocked = state.step === 2 &&
    capacityInfo?.Products?.[0]?.AvailableCapacity === 0;

```

**File:** components/NewSaleWizard.tsx (L77-86)
```typescript
      {state.step < 4 && (
        <WizardNavigation
          step={state.step}
          loading={loading}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
          isCapacityBlocked={isCapacityBlocked}
        />
      )}
    </div>
```

**File:** components/wizard/WizardNavigation.tsx (L32-37)
```typescript
      <button
        type="button"
        disabled={loading || isCapacityBlocked}
        onClick={onNext}
        className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold disabled:opacity-50"
      >
```

**File:** components/wizard/WizardNavigation.tsx (L38-44)
```typescript
        {loading ? <Loader2 className="animate-spin" size={20} /> : (
          <>
            <span>{step === 3 ? 'Complete Sale' : 'Continue'}</span>
            <ChevronRight size={20} />
          </>
        )}
      </button>
```

**File:** components/wizard/ReservationStep.tsx (L10-36)
```typescript
const ReservationStep: React.FC<ReservationStepProps> = ({ reservationId, reservationExpiry }) => {
  const [secondsLeft, setSecondsLeft] = useState(reservationExpiry * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [secondsLeft]);

  const minutes = Math.floor(Math.max(0, secondsLeft) / 60);
  const seconds = Math.max(0, secondsLeft) % 60;
  const isUrgent = secondsLeft < 60 && secondsLeft > 0;
  const isExpired = secondsLeft <= 0;
```

**File:** components/Assistant.tsx (L24-58)
```typescript
const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const { messages, isLoading, sendMessage } = useAssistant();

  /**
   * Handles sending the user prompt to the AI service.
   * @internal
   */
  const handleSend = async () => {
    if (!userPrompt.trim()) return;
    const currentPrompt = userPrompt;
    setUserPrompt('');
    await sendMessage(currentPrompt);
  };

  return (
    <div className="relative">
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <AssistantHeader onClose={() => setIsOpen(false)} />
          <AssistantMessages messages={messages} isLoading={isLoading} />
          <AssistantInput
            prompt={userPrompt}
            setPrompt={setUserPrompt}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};
```

**File:** types.ts (L8-25)
```typescript
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
```

**File:** types.ts (L34-43)
```typescript
export interface ApiResponse {
  /** Indicates if the request was processed successfully. */
  Success: boolean;
  /** Human-readable error message if the request failed. */
  ErrorMessage?: string;
  /** Numeric error code representing the specific failure reason. */
  ErrorCode?: number;
  /** Optional transaction identifier returned by some operations. */
  TransactionId?: string;
}
```

**File:** types.ts (L141-155)
```typescript
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
```

**File:** types.ts (L310-328)
```typescript
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
```

**File:** types.ts (L448-461)
```typescript
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
```

**File:** types.ts (L470-487)
```typescript
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
```

**File:** components/cancellations/CancellationForm.tsx (L18-29)
```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleId) return;

    setError(null);
    try {
      await onSubmit(saleId, reason, comments);
      setSaleId('');
      setComments('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
```

**File:** hooks/useCancellations.ts (L35-36)
```typescript
  const fetchRequests = useCallback(async () => {
    if (!config.apiKey) return;
```

**File:** components/layout/Sidebar.tsx (L13-17)
```typescript
interface SidebarProps {
  isOpen: boolean;
  isTest: boolean;
  onClose: () => void;
}
```

**File:** components/layout/Sidebar.tsx (L25-39)
```typescript
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{children}</span>
  </NavLink>
);
```

**File:** components/layout/Sidebar.tsx (L41-66)
```typescript
const Sidebar: React.FC<SidebarProps> = ({ isOpen, isTest, onClose }) => {
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <SidebarLogo />
          <nav className="space-y-2">
            <NavItem to="/" icon={LayoutDashboard} onClick={onClose}>Dashboard</NavItem>
            <NavItem to="/new-sale" icon={ShoppingBag} onClick={onClose}>New Sale</NavItem>
            <NavItem to="/transactions" icon={History} onClick={onClose}>Transactions</NavItem>
            <NavItem to="/documents" icon={FileText} onClick={onClose}>Docs & Codes</NavItem>
            <NavItem to="/cancellations" icon={XCircle} onClick={onClose}>Cancellations</NavItem>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <NavItem to="/settings" icon={SettingsIcon} onClick={onClose}>Settings</NavItem>
          <TestModeIndicator isTest={isTest} />
        </div>
      </div>
    </aside>
  );
};
```

**File:** components/layout/Sidebar.tsx (L80-92)
```typescript
const TestModeIndicator: React.FC<{ isTest: boolean }> = ({ isTest }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center justify-between text-xs mb-2">
      <span className="text-gray-500">Test Mode</span>
      <span className={`font-bold ${isTest ? 'text-orange-500' : 'text-green-500'}`}>
        {isTest ? 'ENABLED' : 'OFF'}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${isTest ? 'bg-orange-400 w-full' : 'bg-green-400 w-full'}`} />
    </div>
  </div>
);
```

**File:** components/layout/Header.tsx (L10-30)
```typescript
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <button
        type="button"
        aria-label="Toggle navigation menu"
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 p-2 -ml-2"
      >
        <Menu size={24} />
      </button>
      <div className="flex-1 lg:ml-0 ml-4">
        <h2 className="text-lg font-semibold text-gray-800">Sales Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Assistant />
        <UserAvatar initials="SA" />
      </div>
    </header>
  );
};
```

**File:** package.json (L16-30)
```json
  "dependencies": {
    "lucide-react": "^0.574.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.14.0",
    "@typescript-eslint/eslint-plugin": "^8.57.0",
    "@typescript-eslint/parser": "^8.57.0",
    "@vitejs/plugin-react": "^5.0.0",
```

**File:** hooks/useDashboardMetrics.ts (L41-46)
```typescript
  return {
    reservations: '--', // TODO: Implement when endpoint is available
    transactions: transactionCount,
    catalogItems: '--', // TODO: Implement when endpoint is available
    loading
  };
```
