# Auth Setup

To enable Google and Facebook authentication, you need to configure your environment variables.

1. Create a file named `.env.local` in the root of `n2client`.
2. Add the following variables:

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google Provider
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook Provider
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

3. Restart the server if it's running (`npm run dev`).
