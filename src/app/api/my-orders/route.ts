import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tokenResponse = await getAccessToken();
        const accessToken = typeof tokenResponse === 'string' ? tokenResponse : (tokenResponse as any)?.accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found' }, { status: 401 });
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
