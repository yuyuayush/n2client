import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Ensure AUTH0_BASE_URL is defined
        if (!process.env.AUTH0_BASE_URL) {
            console.error("AUTH0_BASE_URL is missing in environment variables.");
        }

        console.log("Debug: Fetching Access Token... BASE_URL:", process.env.AUTH0_BASE_URL);

        const tokenResponse = await auth0.getAccessToken();
        const accessToken = typeof tokenResponse === 'string' ? tokenResponse : (tokenResponse as any)?.accessToken;

        if (!accessToken) {
            console.error("Debug: Access Token is missing/undefined.");
            return NextResponse.json({ error: 'No access token found. User might need to re-login.' }, { status: 401 });
        }

        const isJwt = accessToken.startsWith('eyJ');
        console.log(`Debug: Access Token Logic. Is JWT: ${isJwt}. Length: ${accessToken.length}. Preview: ${accessToken.substring(0, 10)}...`);

        if (!isJwt) {
            console.warn("WARNING: Token appears to be Opaque (not a JWT). Backend validation requires a JWT. Please Ensure AUTH0_AUDIENCE is set and User has Re-Logged in.");
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/orders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Order Fetch Error:", response.status, errorText);

            // If the backend returns 404 (e.g. endpoint not found/implemented), return empty list to prevent UI crash
            if (response.status === 404) {
                return NextResponse.json([]);
            }
            return NextResponse.json({ error: `Backend error: ${response.status} ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy Error:', error);
        // If we can't get token (e.g. not logged in), return 401
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
