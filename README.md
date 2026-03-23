# Experticket Sales Pro

Una aplicación web de gestión de ventas profesional para agentes de la plataforma **Experticket**, construida con React 19, TypeScript y Vite.

---

## 📋 Descripción

**Experticket Sales Pro** es una SPA (Single Page Application) que proporciona a los agentes de ventas todas las herramientas necesarias para gestionar el ciclo de vida completo de una venta de entradas: desde la consulta de catálogo y disponibilidad, pasando por la reserva y confirmación de la transacción, hasta la gestión de cancelaciones y descarga de documentos. Incluye además un **asistente de IA** integrado impulsado por Google Gemini.

---

## ✨ Funcionalidades principales

### 🏠 Dashboard
Vista principal de bienvenida con métricas clave de actividad de ventas y acceso directo al asistente de nueva venta. [1](#0-0) 

### 🛒 New Sale Wizard (Asistente de Nueva Venta)
Flujo guiado de 4 pasos para procesar nuevas ventas:
1. **Selección de Producto** — Elegir proveedor y producto del catálogo.
2. **Comprobación de Capacidad** — Verificar disponibilidad para una fecha dada.
3. **Reserva** — Crear una reserva temporal sobre la capacidad.
4. **Confirmación** — Finalizar la transacción. [2](#0-1) 

### 📜 Transaction Manager (Historial de Transacciones)
Listado, búsqueda y filtrado de transacciones completadas. [3](#0-2) 

### 📄 Documents Panel (Documentos y Códigos)
Búsqueda y descarga de vouchers y entradas en PDF asociados a una transacción por su ID. [4](#0-3) 

### ❌ Cancellation Manager (Cancelaciones)
Formulario para solicitar cancelaciones y panel de historial de solicitudes con sus estados. [5](#0-4) 

### ⚙️ Settings (Configuración)
Interfaz para gestionar las credenciales de la API: Partner ID, API Secret Key, Base URL y modo Sandbox/Test. [6](#0-5) 

### 🤖 AI Assistant
Asistente de chat flotante para ayudar a los agentes con terminología de ticketing, reglas de proveedores y el flujo de ventas, usando la API REST de Gemini 1.5 Flash. [7](#0-6) [8](#0-7) 

---

## 🗂️ Estructura del proyecto

```
experticket-sales-pro/
├── components/
│   ├── layout/          # Sidebar y Header
│   ├── wizard/          # Pasos y sub-componentes del New Sale Wizard
│   ├── dashboard/       # Métricas y tarjetas del dashboard
│   ├── transactions/    # Tabla y filtros de transacciones
│   ├── cancellations/   # Formulario e historial de cancelaciones
│   ├── documents/       # Búsqueda y listado de documentos
│   └── assistant/       # Componentes del chat de IA
├── hooks/               # Custom hooks de React
├── services/            # Clientes de API (Experticket y Gemini AI)
├── src/test/            # Configuración de tests
├── verification/        # Scripts de verificación E2E (Playwright)
├── types.ts             # Interfaces y tipos TypeScript
├── App.tsx              # Raíz de la aplicación y enrutamiento
└── index.html           # HTML base con Tailwind CDN
``` [9](#0-8) 

---

## 🔧 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | ^19.2.4 | Framework UI |
| TypeScript | ~5.8.2 | Tipado estático |
| Vite | ^6.2.0 | Build tool y dev server |
| React Router DOM | ^7.13.0 | Enrutamiento (HashRouter) |
| Tailwind CSS | CDN | Estilos |
| Lucide React | ^0.574.0 | Iconografía |
| Vitest | ^4.0.18 | Testing unitario |
| Testing Library | ^16.3.2 | Testing de componentes |
| jsdom | ^28.1.0 | Entorno de DOM en tests | [10](#0-9) 

---

## 🚀 Instalación y uso

### Prerrequisitos
- Node.js (recomendado v18+)
- npm

### Instalación

```bash
git clone https://github.com/xavirodriguez/experticket-sales-pro.git
cd experticket-sales-pro
npm install
```

### Variables de entorno

Crea un fichero `.env` en la raíz del proyecto con la clave de la API de Google Gemini para el asistente de IA:

```env
VITE_AI_API_KEY=tu_clave_gemini_aqui
``` [11](#0-10) [12](#0-11) 

### Scripts disponibles

```bash
# Servidor de desarrollo (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Ejecutar tests
npm run test

# Tests con interfaz visual
npm run test:ui

# Cobertura de tests
npm run test:coverage

# Análisis de dependencias
npm run depcheck
``` [13](#0-12) [14](#0-13) 

---

## ⚙️ Configuración de la API

Una vez en la aplicación, navega a **Settings** para introducir tus credenciales de Experticket:

| Campo | Descripción |
|---|---|
| `Partner ID` | Identificador único de partner asignado por Experticket |
| `API Secret Key` | Clave secreta de autenticación (solo en memoria, nunca en localStorage) |
| `Base URL` | URL base del API (ej: `api.experticket.com`) |
| `Language Code` | Código ISO 639-1 del idioma (por defecto `en`) |
| `Test Mode` | Activa el entorno sandbox para pruebas |

> ⚠️ **Seguridad**: El `apiKey` se mantiene únicamente en memoria de React y **nunca** se persiste en `localStorage` para mitigar riesgos XSS. [15](#0-14) [16](#0-15) [17](#0-16) 

---

## 🔄 Flujo de venta (Sales Flow)

```mermaid
flowchart TD
    "Catálogo / Providers" --> "Selección de Producto"
    "Selección de Producto" --> "Verificación de Capacidad"
    "Verificación de Capacidad" --> "Creación de Reserva"
    "Creación de Reserva" --> "Confirmación de Transacción"
    "Confirmación de Transacción" --> "Descarga de Documentos"
``` [8](#0-7) [18](#0-17) 

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `DashboardView` | Panel principal con métricas |
| `/new-sale` | `NewSaleWizard` | Asistente de nueva venta |
| `/transactions` | `TransactionManager` | Historial de transacciones |
| `/documents` | `DocumentsPanel` | Documentos y vouchers |
| `/cancellations` | `CancellationManager` | Gestión de cancelaciones |
| `/settings` | `Settings` | Configuración de la API | [19](#0-18) 

---

## 🧪 Tests

El proyecto usa **Vitest** con **jsdom** como entorno de DOM y **Testing Library** para la interacción con componentes.

```bash
npm run test            # Watch mode
npm run test:coverage   # Informe de cobertura (v8)
``` [20](#0-19) 

Para verificaciones end-to-end existe scripts Python con Playwright en la carpeta `verification/`: [21](#0-20) 

---

## 🛡️ Razones de cancelación (`CancellationReason`)

| Código | Constante | Descripción |
|---|---|---|
| 1 | `DATE_CHANGE` | Cambio de fecha solicitado por el cliente |
| 2 | `PRODUCT_CHANGE` | Cambio de producto |
| 3 | `ATTENDEES_CHANGE` | Cambio en número de asistentes |
| 4 | `ILLNESS` | Enfermedad o emergencia médica |
| 5 | `MISMANAGEMENT` | Error en la gestión de la reserva |
| 6 | `INTEGRATION_ISSUES` | Problemas técnicos de integración | [22](#0-21) 

---

## 📦 Servicios principales

### `ExperticketService`
Gestiona toda la comunicación con el backend de Experticket. Autenticación mediante `X-Api-Key` header y construcción automática de URLs parametrizadas. [23](#0-22) 

Métodos disponibles: `getLanguages`, `getProviders`, `getCatalog`, `checkCapacity`, `getRealTimePrices`, `createReservation`, `createTransaction`, `getTransactions`, `getCancellationRequests`, `submitCancellation`, `getTransactionDocuments`.

### `AiService`
Comunica con la API REST de Gemini (`gemini-1.5-flash`) para el asistente de ventas. [24](#0-23) 

---

## Notes

- La aplicación usa `HashRouter` de React Router, por lo que todas las rutas utilizan el formato `/#/ruta`. Esto facilita el despliegue en servidores de archivos estáticos sin necesidad de configuración adicional de reescritura de URLs.
- Tailwind CSS se carga desde CDN en lugar de instalarse como dependencia, tal como está configurado en `index.html`.
- El modo Test/Sandbox está activado por defecto (`isTest: true`), por lo que las transacciones realizadas sin configuración explícita **no serán reservas reales**.
- La configuración (excepto el `apiKey`) se persiste automáticamente en `localStorage` mediante el hook `useConfig`.

### Citations

**File:** components/DashboardView.tsx (L15-50)
```typescript
/**
 * The main dashboard view providing a high-level overview of sales activities.
 *
 * @remarks
 * This view displays key performance metrics and a call to action to start a new sale.
 * It is typically the entry point for sales agents.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <main>
 *   <DashboardView config={config} />
 * </main>
 * ```
 */
const DashboardView: React.FC<DashboardViewProps> = ({ config }) => (
  <div className="space-y-6">
    <DashboardMetrics config={config} />

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome back, Sales Agent</h2>
        <p className="text-gray-600 mb-6">
          Ready to process new bookings? Use the <span className="font-semibold text-blue-600">New Sale Wizard</span> to guide you through capacity checks, pricing, and reservation.
        </p>
        <Link
          to="/new-sale"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Start New Sale
        </Link>
      </div>
    </div>
  </div>
);
```

**File:** components/NewSaleWizard.tsx (L20-35)
```typescript
 * A multi-step wizard component for processing new sales.
 *
 * @remarks
 * This component guides the user through four distinct steps:
 * 1. **Product Selection**: Choose provider and product.
 * 2. **Capacity Check**: Verify availability for a given date.
 * 3. **Reservation**: Create a temporary hold on capacity.
 * 4. **Confirmation**: Finalize the transaction.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <NewSaleWizard config={config} />
 * ```
 */
```

**File:** components/TransactionManager.tsx (L8-30)
```typescript
/**
 * Props for the {@link TransactionManager} component.
 */
interface TransactionManagerProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * Orchestrates the display and filtering of transaction history.
 *
 * @remarks
 * This component coordinates between search filters and the transaction data
 * table. It utilizes the {@link useTransactions} hook to fetch and filter
 * the sales data.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <TransactionManager config={myConfig} />
 * ```
 */
```

**File:** components/DocumentsPanel.tsx (L17-30)
```typescript
/**
 * UI panel for searching and retrieving transaction documents.
 *
 * @remarks
 * This component provides a search interface to find documents by transaction ID
 * and displays a list of available downloads (e.g., tickets, vouchers).
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <DocumentsPanel config={myConfig} />
 * ```
 */
```

**File:** components/CancellationManager.tsx (L16-30)
```typescript
/**
 * Manages the UI for submitting and viewing cancellation requests.
 *
 * @remarks
 * This component coordinates between the cancellation form for submitting
 * new requests and the history panel for viewing existing ones.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <CancellationManager config={myConfig} />
 * ```
 */
const CancellationManager: React.FC<CancellationManagerProps> = ({ config }) => {
```

**File:** components/Settings.tsx (L17-32)
```typescript
 * UI component for managing API credentials and environment settings.
 *
 * @remarks
 * This component allows agents to configure their Partner ID, API Key, and
 * target environment (Base URL and Test Mode). It provides visual feedback
 * during the saving process.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <Settings
 *   config={currentConfig}
 *   onUpdate={(newCfg) => console.log(newCfg)}
 * />
 * ```
```

**File:** components/Assistant.tsx (L9-23)
```typescript
/**
 * An AI-powered sales assistant component.
 *
 * @remarks
 * This component provides a chat interface for sales agents to get assistance
 * with ticketing terminology and platform processes. It utilizes the {@link useAssistant}
 * hook to manage state and communication with the Gemini AI service.
 *
 * @example
 * ```tsx
 * <header>
 *   <Assistant />
 * </header>
 * ```
 */
```

**File:** services/aiService.ts (L4-6)
```typescript
 */
const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

```

**File:** services/aiService.ts (L25-65)
```typescript
export const AiService = {
  /**
   * Fetches a response from the AI model based on the conversation history.
   *
   * @param history - The full conversation history.
   * @returns A promise that resolves to the text response from the AI.
   * @throws Error If the AI API key is not configured or the AI service request fails.
   *
   * @example
   * ```typescript
   * const history = [{ role: 'user', parts: [{ text: "What is a reservation expiry?" }] }];
   * const response = await AiService.fetchResponse(history);
   * console.log(response);
   * ```
   */
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

**File:** services/aiService.ts (L95-106)
```typescript
 */
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

**File:** App.tsx (L1-50)
```typescript
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NewSaleWizard from './components/NewSaleWizard';
import TransactionManager from './components/TransactionManager';
import CancellationManager from './components/CancellationManager';
import DocumentsPanel from './components/DocumentsPanel';
import Settings from './components/Settings';
import DashboardView from './components/DashboardView';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { useConfig } from './hooks/useConfig';

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

**File:** package.json (L1-43)
```json
{
  "name": "experticket-sales-pro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "depcheck": "npx depcheck"
  },
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
    "@vitest/coverage-v8": "^4.0.18",
    "@vitest/ui": "^4.0.18",
    "eslint": "^9.39.4",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "globals": "^17.4.0",
    "jsdom": "^28.1.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "vitest": "^4.0.18"
  }
}
```

**File:** vite.config.ts (L8-11)
```typescript
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
```

**File:** vite.config.ts (L14-17)
```typescript
      define: {
        'process.env.API_KEY': JSON.stringify(env.AI_API_KEY),
        'process.env.AI_API_KEY': JSON.stringify(env.AI_API_KEY)
      },
```

**File:** vite.config.ts (L22-31)
```typescript
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
        },
      },
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

**File:** hooks/useConfig.ts (L22-29)
```typescript
 */
const loadStoredConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: '', // API key is never persisted for security reasons
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: localStorage.getItem(STORAGE_KEYS.IS_TEST) !== 'false' // default to true
});
```

**File:** hooks/useConfig.ts (L36-42)
```typescript
 * Changes to non-sensitive configuration are automatically synchronized with
 * the browser's local storage.
 *
 * The `apiKey` is intentionally kept only in-memory (React state) to mitigate
 * XSS risks.
 *
 * @returns An object containing the current configuration and a function to update it.
```

**File:** hooks/useNewSaleWizard.ts (L86-97)
```typescript
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

**File:** verification/verify_wizard.py (L1-26)
```python

from playwright.sync_api import sync_playwright, expect

def verify_wizard_flow(page):
    # Navigate to the app
    page.goto("http://localhost:3000/#/new-sale")

    # Wait for the wizard to load - look for "Product" in the progress bar
    expect(page.get_by_text("Product").first).to_be_visible()

    # Take a screenshot of the first step
    page.screenshot(path="verification/step1_product_selection.png")

    print("Wizard Step 1 verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            verify_wizard_flow(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/failed.png")
        finally:
```

**File:** services/experticketService.ts (L62-77)
```typescript
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
   * Creates an instance of ExperticketService.
   * @param config - The configuration settings for the API client.
   */
  constructor(private readonly config: ExperticketConfig) {}
```
