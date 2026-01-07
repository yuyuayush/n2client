'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Navigation Items
const navItems: { name: string; href: string }[] = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Market', href: '/products' },
];

export function SiteHeader() {
    const { user, isLoading } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    // Handle scroll effect for glassmorphism intensity
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "bg-background/75 backdrop-blur-xl border-b border-border/50 shadow-sm supports-[backdrop-filter]:bg-background/60"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <span className="text-primary font-bold text-lg">N</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        N2N
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <NavItem key={item.href} href={item.href}>
                            {item.name}
                        </NavItem>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                    ) : user ? (
                        <UserDropdown user={user} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="font-medium hover:bg-primary/5">
                                <Link href="/auth/login">Log in</Link>
                            </Button>
                            <Button asChild className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                                <Link href="/auth/login?screen_hint=signup">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-muted text-foreground/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[61] w-full sm:w-[350px] bg-background border-l shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-xl text-foreground">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item, idx) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block p-4 rounded-xl hover:bg-muted font-medium text-lg text-foreground transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 border-t">
                                {user ? (
                                    <div className="bg-muted/50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            {user.picture ? (
                                                <img src={user.picture} alt={user.name || "User"} className="w-10 h-10 rounded-full border" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-medium truncate text-foreground">{user.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild className="w-full justify-start">
                                                <Link href="/profile">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Profile
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild className="w-full justify-start opacity-90 hover:opacity-100">
                                                <Link href="/auth/logout">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Button size="lg" variant="outline" asChild className="w-full justify-center">
                                            <Link href="/auth/login">Log in</Link>
                                        </Button>
                                        <Button size="lg" asChild className="w-full justify-center">
                                            <Link href="/auth/login?screen_hint=signup">Sign Up</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

// Helper Components

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={cn(
            "relative text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
        )}>
            {children}
            {isActive && (
                <motion.div
                    layoutId="desktop-navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
            )}
        </Link>
    );
}

function UserDropdown({ user }: { user: any }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border outline-none focus-visible:ring-2 ring-primary/50"
            >
                {user.picture ? (
                    <img src={user.picture} alt={user.name || "User"} className="w-8 h-8 rounded-full border shadow-sm" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <span className="text-primary-foreground font-bold text-sm">
                            {initial}
                        </span>
                    </div>
                )}
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-black border border-border rounded-xl shadow-2xl p-2 z-50 overflow-hidden ring-1 ring-black/5"
                    >
                        <div className="px-3 py-3 border-b border-border mb-2 bg-muted/50 -mx-2 -mt-2">
                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">Welcome back</p>
                            <p className="font-medium text-sm truncate text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                        </div>

                        <div className="mt-2 pt-2 border-t">
                            <Link
                                href="/auth/logout"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

