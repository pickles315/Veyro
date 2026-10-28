# Veyro

Veyro is a personal AI chat project using GitHub Pages for the frontend and Supabase for authentication, storage, row-level security, and an Edge Function that calls an AI provider.

## Current setup

- Static frontend: `index.html`
- Supabase project: `nkcnyaioyafmcosuanlo`
- Database: `conversations`, `messages`, `memories`, `user_settings`
- Edge Function: `veyro-chat`
- Sign-in: email magic link
- AI provider: OpenRouter's free-model router (availability and limits can change)

## Finish setup

1. In Supabase, open **Authentication → URL Configuration** and add your GitHub Pages site URL to the allowed redirect URLs. For example: `https://pickles315.github.io/Veyro/` (adjust if your Pages URL differs).
2. Ensure email sign-in is enabled under **Authentication → Sign In / Providers**.
3. Create an OpenRouter account and an API key. Select/use free models only if you want to avoid paid usage; free-model availability and limits are not guaranteed.
4. In Supabase, open **Edge Functions → Secrets** (or project secrets) and add `OPENROUTER_API_KEY`. Never put that secret in this repository.
5. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
6. Open the published site and sign in through the emailed link.

## Security notes

- The browser contains only the Supabase publishable key. It is intended for public clients; row-level security protects user-owned records.
- Do not add Supabase service-role keys or AI provider keys to frontend code or GitHub.
- The AI Edge Function requires a valid signed-in Supabase session.
- This initial version does not send unsolicited notifications. Proactive messages need an additional scheduler/notification design and explicit user opt-in.

## Local testing

Open `index.html` through a local web server rather than `file://` if auth redirects behave unexpectedly. For example, with Python installed, run `py -m http.server 8000` from this directory, then visit `http://localhost:8000` and add that URL to Supabase Auth redirect URLs while testing.
