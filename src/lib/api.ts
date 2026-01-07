const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}


async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
   
    const isInternalApi = endpoint.startsWith('/api/');
    const url = isInternalApi ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `API Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Return null for 204 No Content, otherwise parse JSON
        if (response.status === 204) {
            return null as T;
        }

        return await response.json();
    } catch (error: any) {
        console.error(`API Request Failed: [${options.method || 'GET'} ${url}]`, error);
        throw error;
    }
}

// --- Type Definitions ---

export interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    image?: string;
    rating?: number;
}

export interface PaymentIntentResponse {
    clientSecret: string;
}

export interface Order {
    _id: string;
    userId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    createdAt: string;
}

export interface CreatePaymentIntentDto {
    amount: number;
    currency: string;
    metadata?: any;
}

// --- API Methods ---

export const api = {
    products: {
        getAll: () => request<Product[]>('/products'),
        getOne: (id: string) => request<Product>(`/products/${id}`),
        create: (data: Omit<Product, 'id'>) => request<Product>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    payments: {
        createIntent: (data: CreatePaymentIntentDto) => request<PaymentIntentResponse>('/payments/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    orders: {
        getMyOrders: () => request<Order[]>('/api/my-orders'),
    }
};
