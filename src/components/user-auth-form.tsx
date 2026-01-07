"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "login" | "register"
}

export function UserAuthForm({ className, type = "login", ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <div className="grid gap-4">
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => window.location.href = "/auth/login"}>
                    Login with Auth0
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => window.location.href = "/auth/signup"}>
                    Sign Up with Auth0
                </Button>
            </div>
        </div>
    )
}
