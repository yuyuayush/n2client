"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type ProductForm = {
    name: string;
    price: number;
    description: string;
    currency: string;
};

export default function AddProductPage() {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [isLoading, user, router]);

    const onSubmit = async (data: ProductForm) => {
        setSubmitting(true);
        try {
            // Convert price to smallest currency unit (e.g. cents) if needed, 
            // but backend example used integers like 29900 for $299.00. 
            // Let's assume input is in dollars and we multiply by 100.
            const payload = {
                ...data,
                price: Number(data.price) * 100, // primitive handling
                currency: 'usd'
            };

            const res = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create product');

            router.push('/products');
        } catch (e) {
            console.error(e);
            alert('Error creating product');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || !user) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded-lg shadow-sm">

                <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                        {...register('name', { required: true })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. Super Widget"
                    />
                    {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price', { required: true, min: 0 })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="29.99"
                    />
                    {errors.price && <span className="text-red-500 text-sm">Valid price is required</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        className="w-full border rounded px-3 py-2 min-h-[100px]"
                        placeholder="Product details..."
                    />
                    {errors.description && <span className="text-red-500 text-sm">Description is required</span>}
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Creating...' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
}
