"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useUser } from "@auth0/nextjs-auth0/client"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ amount, currency }: { amount: number, currency: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return;

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout`,
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.")
        } else {
            setMessage("An unexpected error occurred.")
        }

        setIsLoading(false)
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isLoading || !stripe || !elements} id="submit" className="mt-4 bg-green-600 hover:bg-green-700 w-full text-lg font-medium h-12 rounded-xl transition-all shadow-md active:scale-95">
                <span id="button-text">
                    {isLoading ? <div className="border-t-transparent border-solid animate-spin rounded-full border-white border-2 h-5 w-5 mx-auto"></div> : "Pay now"}
                </span>
            </Button>
            {message && <div id="payment-message" className="text-red-500 mt-2 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{message}</div>}
        </form>
    )
}

function CheckoutContent() {
    const { user } = useUser();
    const searchParams = useSearchParams()

    // Check for payment redirect status
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");

    // Parse query params from ProductDetail page (for initial load)
    // Parse query params
    const amountParam = searchParams.get("amount") || searchParams.get("price")
    const quantityParam = searchParams.get("quantity")
    const productId = searchParams.get("productId")

    // Calculate total amount in cents
    // Input is expected to be in cents (e.g. 4999 for $49.99)
    const unitPriceInCents = parseFloat(amountParam || "0")
    const quantity = parseInt(quantityParam || "1", 10)
    const amountInCents = Math.round(unitPriceInCents * quantity)

    const currency = "usd"

    const [clientSecret, setClientSecret] = useState(paymentIntentClientSecret || "")
    const [error, setError] = useState("")

    // Success State Handling - Redirect from Stripe
    if (redirectStatus === 'succeeded') {
        setTimeout(() => {
            window.location.href = '/orders';
        }, 3000);

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-green-50/30 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl shadow-inner animate-bounce">
                        ✓
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 text-lg">Redirecting you to orders...</p>
                    </div>
                    <div className="pt-6 space-y-4">
                        <div className="text-sm bg-gray-50 p-4 rounded-xl text-gray-500 border border-gray-100">
                            Transaction ID: <span className="font-mono text-gray-700 font-bold">{paymentIntentClientSecret?.slice(-8).toUpperCase()}</span>
                        </div>
                        <Button className="w-full text-black h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" onClick={() => window.location.href = '/orders'}>
                            View Your Orders Now
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Failed State Handling
    if (redirectStatus === 'failed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">!</div>
                    <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
                    <p className="text-gray-600">Something went wrong with your payment. Please try again.</p>
                    <Button className="mt-4 w-full" onClick={() => window.location.href = '/'} variant="outline">Return to Home</Button>
                </div>
            </div>
        )
    }

    // Safety checks
    useEffect(() => {
        if (!stripePromise) {
            setError("Configuration Error: Stripe Publishable Key is missing in frontend .env.local");
        }
    }, []);

    // Fetch Intent
    useEffect(() => {
        // Only fetch new intent if not a redirect and we have a valid amount
        if (!paymentIntentClientSecret && amountInCents > 0 && !clientSecret) {

            // Prepare metadata for webhook
            const metadata = {
                userId: user?.sub || 'guest',
                items: JSON.stringify([{
                    productId: productId || 'unknown',
                    quantity,
                    price: unitPriceInCents
                }])
            };

            api.payments.createIntent({ amount: amountInCents, currency, metadata })
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => {
                    console.error("Checkout Error:", err);
                    setError(`Failed to load payment system. Is the backend running? (${err.message})`);
                })
        } else if (!amountInCents && !paymentIntentClientSecret) {
            // Valid case: user just landed on checkout without items or redirect
            setError("Invalid cart total or missing payment information.");
        }
    }, [amountInCents, currency, paymentIntentClientSecret, user, productId, unitPriceInCents, quantity]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            labels: 'floating' as const,
        },
    }

    // Error UI
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="p-8 bg-white text-center rounded-xl shadow-lg border border-red-100 max-w-md w-full">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">!</div>
                    <p className="text-red-500 mb-6 font-medium">{error}</p>
                    <Button onClick={() => window.location.href = '/'} variant="outline">Go Back Home</Button>
                </div>
            </div>
        );
    }

    // Loading UI
    if (!clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse font-medium">Initializing Secure Checkout...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Checkout</h2>
                    <p className="mt-2 text-sm text-gray-600">Complete your purchase securely</p>
                </div>

                {amountInCents > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">
                                {(amountInCents / 100).toLocaleString("en-US", { style: "currency", currency })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Qty: {quantity}</p>
                        </div>
                    </div>
                )}

                {clientSecret && stripePromise && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm amount={amountInCents} currency={currency} />
                    </Elements>
                )}
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}
