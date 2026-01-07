"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Star, Plus } from 'lucide-react';

import { DUMMY_PRODUCTS } from '@/lib/dummy-data';

export default function Dashboard() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const [products, setProducts] = useState(DUMMY_PRODUCTS);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl my-8 mx-auto max-w-2xl">
            <p>Error: {error.message}</p>
        </div>
    );

    if (!user) return null;

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in min-h-screen pb-20">
            {/* Dashboard Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="flex items-center w-full md:w-auto">
                    <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Button variant="outline" asChild className="gap-2 h-10 hover:bg-muted/50 border-input/50">
                        <Link href="/orders">
                            <Package className="w-5 h-5 text-muted-foreground" />
                            <span className="hidden sm:inline">Orders</span>
                        </Link>
                    </Button>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 shadow-md shadow-primary/20">
                        <Link href="/cart">
                            <ShoppingCart className="w-5 h-5 mr-2" /> Cart
                        </Link>
                    </Button>
                    {/* Admin Quick Link */}
                    <Link href="/admin/products/new" className="px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Sell
                    </Link>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4 border border-white/10">
                        Limited Time Offer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Prime Deals</h1>
                    <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                        Unlock exclusive savings on top-tier tech. Curated just for you.
                    </p>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700 border-none font-bold shadow-lg">
                        Shop Now
                    </Button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
                <div className="absolute right-8 bottom-8 md:right-16 md:bottom-[-20px] opacity-20 rotate-[-15deg]">
                    <ShoppingCart className="w-48 h-48 md:w-64 md:h-64 text-white" />
                </div>
            </div>

            {/* Product Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Recommended for you</h2>
                    <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        View all &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
                        >
                            <Link href={`/products/${product.id}`} className="block h-full cursor-pointer">
                                <div className="aspect-square bg-muted/50 relative overflow-hidden p-6 flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-contain w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" className="rounded-full shadow-sm hover:text-red-500" onClick={(e) => {
                                            e.preventDefault(); // Prevent navigating when clicking the like button
                                            // Handle like logic here if needed
                                        }}>
                                            <Star className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div>
                                    <Link href={`/products/${product.id}`} className="block group/title">
                                        <h3 className="font-semibold text-lg leading-tight text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-medium text-foreground">{product.rating}</span>
                                        <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 500) + 50} reviews)</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Price</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-sm font-medium text-muted-foreground">$</span>
                                            <span className="text-xl font-bold text-foreground">{Math.floor(product.price / 100)}</span>
                                            <span className="text-xs font-semibold text-muted-foreground">.{((product.price / 100) % 1).toFixed(2).substring(2)}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" className="rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
