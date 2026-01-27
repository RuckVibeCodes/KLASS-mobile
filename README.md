# KLASS Mobile

React Native + Expo mobile app for [KLASS](https://github.com/RuckVibeCodes/KLASS) — a Skool-style white-label creator community platform.

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Routing:** Expo Router (file-based)
- **Auth:** Clerk (`@clerk/clerk-expo`)
- **Database:** Supabase (`@supabase/supabase-js`)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Animations:** React Native Reanimated
- **Secure Storage:** Expo SecureStore

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator (Mac) or Android Emulator

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/RuckVibeCodes/KLASS-mobile.git
   cd KLASS-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — from [Clerk Dashboard](https://dashboard.clerk.com)
   - `EXPO_PUBLIC_SUPABASE_URL` — from [Supabase Dashboard](https://supabase.com/dashboard)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Dashboard

5. Start the dev server:
   ```bash
   npx expo start
   ```

## Project Structure

```
├── app/
│   ├── (auth)/           # Auth screens (sign-in, sign-up)
│   ├── (tabs)/           # Main tab screens
│   │   ├── index.tsx     # Home feed
│   │   ├── programs.tsx  # Courses & learning
│   │   ├── resources.tsx # Files & materials
│   │   ├── events.tsx    # Community events
│   │   └── profile.tsx   # User profile
│   ├── members.tsx       # Members list (stack screen)
│   └── _layout.tsx       # Root layout with Clerk provider
├── components/
│   └── ui/               # Reusable UI components
├── constants/            # Colors, config
├── hooks/                # Custom React hooks
├── lib/                  # Supabase client, Clerk token cache
└── types/                # TypeScript type definitions
```

## Related

- **Web Dashboard:** [RuckVibeCodes/KLASS](https://github.com/RuckVibeCodes/KLASS)
