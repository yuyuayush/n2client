"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Order } from "@/lib/api";
import { DUMMY_PRODUCTS } from "@/lib/dummy-data";
import { ShoppingCart, Package, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
    const { user, isLoading } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoading) return;
        if (!user) return; // redirect handled by middleware or link

        api.orders.getMyOrders()
            .then(setOrders)
            .catch(err => {
                console.error("Orders fetch error:", err);
                setError(err.message || "Unable to load orders at this time.");
            })
            .finally(() => setLoading(false));

    }, [user, isLoading]);

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="mb-4">Please log in to view orders.</p>
                <Link href="/auth/login" className="text-primary underline">Log In</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                    <Link href="/dashboard" className="text-primary hover:underline font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border text-center">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No orders yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-8">Looks like you haven&apos;t placed any orders yet. Check out our marketplace!</p>
                        <Link href="/products" className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                                {/* Order Header */}
                                <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Order Placed</p>
                                            <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Total</p>
                                            <p className="font-bold text-foreground">
                                                {(order.amount / 100).toLocaleString("en-US", { style: "currency", currency: order.currency })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Order ID</p>
                                            <p className="font-mono text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${order.status === 'paid'
                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
                                            : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50'
                                            }`}>
                                            {order.status === 'paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item, idx) => {
                                            // Try to find the product in dummy data to show image
                                            // In a real app, the order item would have the image or we'd fetch it.
                                            // We assume item.productId might match one of our dummy IDs or we use a fallback.
                                            const product = DUMMY_PRODUCTS.find(p => p.id === item.productId || p.name === item.productId);
                                            // Fallback logic if productId is just a name or random ID.

                                            return (
                                                <div key={idx} className="flex flex-col sm:flex-row items-start gap-5">
                                                    <div className="relative w-24 h-24 bg-muted/50 rounded-xl border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {product?.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                                                        ) : (
                                                            <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-lg text-foreground truncate pr-4">
                                                            {product?.name || item.productId}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {product?.description || "Product description not available."}
                                                        </p>

                                                        <div className="mt-3 flex items-center gap-4">
                                                            <div className="text-sm text-foreground font-medium bg-muted/50 px-2 py-0.5 rounded-md border border-border">
                                                                Qty: {item.quantity}
                                                            </div>
                                                            <Link href={`/products/${product?.id || ''}`} className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                                                                View Product <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="text-right sm:text-left">
                                                        <p className="text-lg font-bold text-foreground">
                                                            {((item.price / 100) * item.quantity).toLocaleString("en-US", { style: "currency", currency: order.currency })}
                                                        </p>
                                                        {item.quantity > 1 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {(item.price / 100).toLocaleString("en-US", { style: "currency", currency: order.currency })} each
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
