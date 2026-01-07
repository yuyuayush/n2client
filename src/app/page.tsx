"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
    const { user, isLoading } = useUser();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center relative bg-background overflow-hidden">

            {/* Background Gradient Blob */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] -z-10" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl space-y-12 py-12"
            >
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                        The Future of <br />
                        <span className="text-primary">Digital Commerce</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Experience a seamless shopping journey built with Next.js, NestJS, and Auth0.
                        Secure, fast, and beautifully designed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {isLoading ? (
                        <div className="h-12 w-32 bg-muted rounded-xl animate-pulse" />
                    ) : user ? (
                        <Link href="/dashboard" className="modern-button bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-lg rounded-xl shadow-lg shadow-primary/25">
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    ) : (
                        <Link href="/auth/login" className="modern-button bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-lg rounded-xl shadow-lg shadow-primary/25">
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                    <Link href="/products" className="modern-button bg-card hover:bg-accent text-foreground border border-border h-12 px-8 text-lg rounded-xl">
                        Browse Marketplace
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
                    {[
                        { icon: ShieldCheck, title: "Secure Auth", desc: "Powered by Auth0 using Industry standards." },
                        { icon: Zap, title: "Fast Performance", desc: "Optimized with Next.js & Turbopack." },
                        { icon: ShoppingBag, title: "Easy Checkout", desc: "Seamless payments with Stripe integration." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="modern-card p-8 border border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
