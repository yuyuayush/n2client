"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { DUMMY_PRODUCTS } from '@/lib/dummy-data';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const id = params?.id as string;
            const found = DUMMY_PRODUCTS.find((p: any) => p.id === id);
            if (found) {
                setProduct(found);
            }
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    const handleBuyNow = () => {
        if (!user) {
            // Redirect to login with return url
            router.push(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        // In a real app, you would call an API to create a Stripe session here.
        // For now, we'll redirect to a checkout page with the product details.
        const query = new URLSearchParams({
            productId: product.id,
            quantity: selectedQuantity.toString(),
            amount: product.price.toString(),
            currency: product.currency || 'usd',
            name: encodeURIComponent(product.name)
        }).toString();
        router.push(`/checkout?${query}`);
    };

    const similarProducts = DUMMY_PRODUCTS.filter((p: any) => p.id !== product.id).slice(0, 4);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Breadcrumb / Back Navigation */}
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to results
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
                    {/* Left Column: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm flex items-center justify-center p-8">
                            <motion.img
                                src={product.image}
                                alt={product.name}
                                className="object-contain w-full h-full drop-shadow-2xl z-10"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className={`aspect-square rounded-xl border-2 ${i === 0 ? 'border-primary' : 'border-transparent'} bg-card overflow-hidden cursor-pointer hover:border-primary/50 transition-colors p-2`}>
                                    <img src={product.image} alt="Thumbnail" className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col space-y-8"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">In Stock</span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsLiked(!isLiked)}>
                                        <Heart className={cn("w-5 h-5", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Share2 className="w-5 h-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground tight tracking-tight mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-muted-foreground text-sm font-medium border-l border-border pl-4">{product.reviews} verified reviews</span>
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-foreground">${Math.floor(product.price / 100)}</span>
                                <span className="text-xl font-medium text-foreground">.{((product.price / 100) % 1).toFixed(2).substring(2)}</span>
                            </div>

                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Feature List */}
                        <div className="grid grid-cols-2 gap-4">
                            {product.features?.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-border my-6" />

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-border rounded-xl bg-card shadow-sm h-12">
                                    <button
                                        className="w-12 h-full flex items-center justify-center hover:bg-muted text-lg font-medium transition-colors rounded-l-xl active:bg-muted/80"
                                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-foreground">{selectedQuantity}</span>
                                    <button
                                        className="w-12 h-full flex items-center justify-center hover:bg-muted text-lg font-medium transition-colors rounded-r-xl active:bg-muted/80"
                                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <Button className="flex-1 h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 rounded-xl">
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                </Button>
                            </div>
                            <Button
                                onClick={handleBuyNow}
                                variant="outline"
                                className="w-full h-12 text-lg font-bold border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-[1.01] active:scale-95 transition-all duration-200 rounded-xl"
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-card border border-border/50">
                                <Truck className="w-6 h-6 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-card border border-border/50">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">2 Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-card border border-border/50">
                                <RefreshCw className="w-6 h-6 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">30 Day Returns</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Similar Products Section */}
                <div className="space-y-8 border-t border-border pt-16">
                    <h2 className="text-2xl font-bold text-foreground">Similar Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
                            >
                                <Link href={`/products/${item.id}`} className="block h-full cursor-pointer">
                                    <div className="aspect-square bg-muted/50 relative overflow-hidden p-6 flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-contain w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="secondary" className="rounded-full shadow-sm hover:text-red-500" onClick={(e) => {
                                                e.preventDefault();
                                            }}>
                                                <Star className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-5 flex-1 flex flex-col gap-3">
                                    <div>
                                        <Link href={`/products/${item.id}`} className="block group/title">
                                            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm font-medium text-foreground">{item.rating}</span>
                                            <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 500) + 50})</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Price</span>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-sm font-medium text-muted-foreground">$</span>
                                                <span className="text-xl font-bold text-foreground">{Math.floor(item.price / 100)}</span>
                                                <span className="text-xs font-semibold text-muted-foreground">.{((item.price / 100) % 1).toFixed(2).substring(2)}</span>
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
        </div>
    );
}
