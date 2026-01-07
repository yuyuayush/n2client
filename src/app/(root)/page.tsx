import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to <span className="text-primary">N2 Client</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          A powerful Next.js application integrated with Auth0 for secure authentication
          and built with Shadcn UI for a clean, modern aesthetic.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login?screen_hint=signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/shadcn-ui/ui" target="_blank">
              Documentation
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
          </div>
          <h3 className="text-lg font-semibold">Secure Auth</h3>
          <p className="text-muted-foreground text-sm">Powered by Auth0 for enterprise-grade security.</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M7.5 3.5a1 1 0 0 0-1.5 1 1 0 0 1-1.5 1 1 0 0 0-1.5 1 1 0 0 1-1.5 1 1 0 0 0-.5 1v15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2" /><path d="M13 13h7" /><path d="M17 9l4 4-4 4" /></svg>
          </div>
          <h3 className="text-lg font-semibold">Modern UI</h3>
          <p className="text-muted-foreground text-sm">Beautifully designed components using Shadcn UI.</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
          </div>
          <h3 className="text-lg font-semibold">Type Safe</h3>
          <p className="text-muted-foreground text-sm">Built with TypeScript for robust and error-free code.</p>
        </div>
      </div>
    </div>
  )
}
