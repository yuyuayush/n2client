'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Profile() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
    if (error) return <div>{error.message}</div>;

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Not Logged In</CardTitle>
                        <CardDescription>Please login to view your profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center h-screen bg-muted/20">
            <Card className="w-full max-w-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                    {user.picture && (
                        <Image
                            src={user.picture}
                            alt={user.name || "Profile"}
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                    )}
                    <div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                    <Button asChild variant="destructive" className="w-full">
                        <Link href="/auth/logout">Logout</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
