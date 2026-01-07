"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useProductStore } from "@/store/useProductStore";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { DUMMY_PRODUCTS } from "@/lib/dummy-data";

export default function ProductsPage() {
    const router = useRouter();
    const { user, isLoading: isUserLoading } = useUser();
    const { products, isLoading, fetchProducts } = useProductStore();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push("/auth/login");
        } else if (user) {
            fetchProducts();
        }
    }, [user, isUserLoading, router, fetchProducts]);

    if (isUserLoading || isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse text-xl font-medium text-gray-400">Loading marketplace...</div>
        </div>
    );

    const displayProducts = products.length > 0 ? products : DUMMY_PRODUCTS;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Marketplace
                    </h1>
                    <p className="text-gray-500 mt-2">Discover unique digital products.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
                    >
                        <div className="block cursor-pointer" onClick={() => router.push(`/checkout?amount=${product.price}&currency=${product.currency}&name=${encodeURIComponent(product.name)}`)}>
                            <div className="aspect-square bg-muted/50 relative overflow-hidden p-6 flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-contain w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <ShoppingCart className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                )}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-3">
                            <div>
                                <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1.5">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-medium text-foreground">{product.rating || 4.5}</span>
                                    <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 500) + 50} reviews)</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Price</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm font-medium text-muted-foreground">$</span>
                                        <span className="text-xl font-bold text-foreground">{Math.floor(product.price / 100)}</span>
                                        <span className="text-xs font-semibold text-muted-foreground">.{((product.price / 100) % 1).toFixed(2).substring(2)}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all"
                                    onClick={() => router.push(`/checkout?amount=${product.price}&currency=${product.currency}&name=${encodeURIComponent(product.name)}`)}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {displayProducts.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No products found. Be the first to add one!</p>
                </div>
            )}
        </div>
    );
}
