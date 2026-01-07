import { create } from 'zustand';
import { api, Product } from '@/lib/api';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.products.getAll();
            set({ products: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    addProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
            await api.products.create(product);
            // Refresh list after add
            await get().fetchProducts();
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    }
}));
