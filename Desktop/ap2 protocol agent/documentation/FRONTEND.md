# Frontend Documentation

## Overview

The AP2 Commerce Demo frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS. It provides an intuitive interface for users to interact with the AP2 agent system.

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **clsx** - Conditional class utility

## Project Structure

```
ap2-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── AgentLogsPanel.tsx
│   │   ├── AgentTimeline.tsx
│   │   ├── PaymentSelector.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── PromptInput.tsx
│   │   └── ReceiptModal.tsx
│   ├── api/
│   │   └── ap2Api.ts       # API client
│   ├── hooks/
│   │   └── useAgentLogs.ts # Custom hooks
│   ├── styles/
│   │   └── tailwind.css    # Global styles
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Core Components

### 1. App.tsx

**Purpose:** Main application orchestrator that manages the entire workflow state.

**Key Responsibilities:**
- Workflow step management (Idle → Shopping → Merchant → Payment → Receipt)
- Product and alternative products state
- Auto-purchase mode coordination
- API integration

**State Management:**
```typescript
const [step, setStep] = useState(0);           // Workflow step
const [product, setProduct] = useState<Product | null>(null);
const [alternatives, setAlternatives] = useState<Product[]>([]);
const [receipt, setReceipt] = useState<Receipt | null>(null);
const [isAutoMode, setIsAutoMode] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

**Workflow Steps:**
- `0` - Idle (search screen)
- `1` - Shopping Agent active
- `2` - Merchant Agent active (product selection)
- `3` - Credentials Provider active (payment method)
- `4` - Payment Processor active (transaction)

### 2. PromptInput.tsx

**Purpose:** User input component with advanced filter settings.

**Features:**
- Product search input
- Collapsible filter settings panel
- Auto-purchase toggle
- Budget slider (₹500 - ₹200,000)
- Quick amount presets (₹10K, ₹50K, ₹100K, ₹200K)

**Props:**
```typescript
interface PromptInputProps {
  onSubmit: (prompt: string, isAuto: boolean, maxAmount: number) => void;
  isLoading: boolean;
}
```

**UI Features:**
- Glassmorphism design
- iOS-style toggle switch
- Gradient-filled slider
- Responsive layout

### 3. ProductCarousel.tsx

**Purpose:** Displays product alternatives in a vertical list.

**Features:**
- Vertical product list (up to 3 products)
- Product selection with visual feedback
- Hover effects and transitions
- Price and merchant information display

**Props:**
```typescript
interface ProductCarouselProps {
  products: Product[];
  selectedProduct: Product;
  onSelect: (product: Product) => void;
}
```

### 4. ProductCard.tsx

**Purpose:** Displays selected product details with purchase action.

**Features:**
- Product name, price, and merchant
- "Proceed to Payment" button
- Auto-purchase loading state
- Disabled state for invalid products

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onProceed: () => void;
  isAutoPurchasing?: boolean;
}
```

### 5. PaymentSelector.tsx

**Purpose:** Payment method selection interface.

**Features:**
- Credit card and UPI options
- UPI hidden in auto-purchase mode
- Back button (manual mode only)
- Payment amount display

**Props:**
```typescript
interface PaymentSelectorProps {
  amount: number;
  onPay: (methodId: string) => void;
  onBack?: () => void;
  isLoading: boolean;
  isAuto?: boolean;
}
```

### 6. AgentTimeline.tsx

**Purpose:** Visual timeline showing agent workflow progress.

**Features:**
- 4-step timeline visualization
- Active step highlighting
- Completion indicators
- Smooth transitions

**Steps:**
1. Shopping Agent
2. Merchant Agent
3. Credentials Provider
4. Payment Processor

### 7. AgentLogsPanel.tsx

**Purpose:** Real-time display of agent communication logs.

**Features:**
- Live log streaming
- Agent-specific color coding
- Timestamp display
- Auto-scroll to latest
- Glassmorphism design

**Props:**
```typescript
interface AgentLogsPanelProps {
  logs: AgentLog[];
}
```

### 8. ReceiptModal.tsx

**Purpose:** Transaction receipt display modal.

**Features:**
- Transaction ID
- Amount paid
- Success animation
- "Start New Purchase" action

## API Client (ap2Api.ts)

### Endpoints

#### 1. Send Intent
```typescript
sendIntent(prompt: string): Promise<IntentResponse>
```

**Request:**
```json
{
  "prompt": "iphone 16"
}
```

**Response:**
```json
{
  "product": {
    "name": "Apple iPhone 16",
    "price": 64999,
    "brand": "Apple",
    "merchant": "CoffeeRoasters"
  },
  "alternatives": [...],
  "agentLogs": [...]
}
```

#### 2. Update Product
```typescript
updateProduct(product: Product): Promise<void>
```

Called when user selects a different product from the carousel.

#### 3. Process Payment
```typescript
processPayment(paymentMethod: string): Promise<PaymentResponse>
```

**Request:**
```json
{
  "paymentMethod": "card_1"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "receiptId": "txn_abc123",
  "agentLogs": [...]
}
```

## Custom Hooks

### useAgentLogs

**Purpose:** Manages agent log state with add and clear operations.

```typescript
const { logs, addLogs, clearLogs } = useAgentLogs();
```

**Methods:**
- `addLogs(newLogs: AgentLog[])` - Append new logs
- `clearLogs()` - Clear all logs

## Styling

### Tailwind Configuration

**Custom Colors:**
```javascript
colors: {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  border: '#2a2a2a',
}
```

**Custom Animations:**
- `animate-in` - Fade and slide in
- `fade-in` - Opacity transition
- `slide-in-from-bottom-4` - Slide up animation

### Design System

**Typography:**
- Headings: `font-bold`, `text-2xl` to `text-4xl`
- Body: `text-sm` to `text-lg`
- Monospace: `font-mono` for IDs and amounts

**Colors:**
- Primary: Indigo (`indigo-500`, `indigo-600`)
- Success: Emerald (`emerald-500`, `emerald-600`)
- Warning: Amber (`amber-500`)
- Error: Red (`red-500`)

**Effects:**
- Glassmorphism: `backdrop-blur-xl`, `bg-gray-900/90`
- Shadows: `shadow-2xl`, `shadow-black/20`
- Borders: `border-gray-700/50`

## State Flow

### Auto-Purchase Flow

```
1. User submits prompt with auto-purchase enabled
2. App.tsx calls sendIntent()
3. Products loaded, setIsLoading(false)
4. Auto-scroll to product card
5. Wait 2 seconds (user can see products)
6. Auto-call handlePayment('card_1', productPrice)
7. Payment processed
8. Receipt displayed
```

### Manual Purchase Flow

```
1. User submits prompt
2. Products displayed
3. User selects product (optional)
4. User clicks "Proceed to Payment"
5. Payment method selection
6. User clicks "Pay ₹X"
7. Payment processed
8. Receipt displayed
```

## Key Features

### 1. Auto-Purchase

- Budget limit enforcement
- Automatic product selection (first/best match)
- 2-second delay for visibility
- Loading indicators
- Auto-scroll to purchase button

### 2. Product Selection

- Up to 3 product alternatives
- Click to select different product
- Backend cart mandate update
- Visual selection feedback

### 3. Back Navigation

- "Back to Search" on product page (manual mode)
- "Back to Products" on payment page (manual mode)
- Hidden in auto-purchase mode
- State preservation

### 4. Responsive Design

- Mobile-first approach
- Grid layout for desktop (`lg:grid-cols-12`)
- Sticky agent logs panel
- Smooth transitions

## Development

### Running Dev Server

```bash
npm run dev
```

Starts Vite dev server with hot module replacement at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory.

### Type Checking

```bash
npm run type-check
```

Runs TypeScript compiler in check mode.

## Best Practices

1. **Component Organization:** Keep components focused and single-responsibility
2. **Type Safety:** Use TypeScript interfaces for all props and state
3. **State Management:** Lift state to App.tsx for shared data
4. **Error Handling:** Graceful fallbacks for API failures
5. **Accessibility:** Semantic HTML and ARIA labels
6. **Performance:** Lazy loading and code splitting where appropriate

## Future Enhancements

- [ ] Product image support
- [ ] Multiple payment methods
- [ ] Transaction history
- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Advanced filters (category, price range)
- [ ] Dark/Light theme toggle

---

For backend integration details, see [Backend Documentation](./BACKEND.md).
