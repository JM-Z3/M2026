# Mobile App Base

This repository contains an Expo-managed React Native starter configured with TypeScript, React Navigation, and Supabase auth scaffolding. It includes placeholder screens for upcoming features and uses Supabase session state to control navigation.

## Prerequisites
- Node.js (LTS recommended)
- npm (bundled with Node.js)
- Expo CLI (installed automatically via npm scripts)

## Setup environment variables
1. Copy the example file and fill in your Supabase project values:
   ```
   cp .env.example .env
   ```
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` with your Supabase project credentials.
3. Optional: set `EXPO_PUBLIC_TEST_EMAIL` and `EXPO_PUBLIC_TEST_PASSWORD` to enable the placeholder test sign-in button.

## Install dependencies
```
npm install
```

## Run the app
Start the Expo development server:
```
npm start
```

You can also target specific platforms:
```
npm run android
npm run ios
npm run web
```

## Open on a physical device
1. Install the **Expo Go** app from the iOS App Store or Google Play Store.
2. Ensure your device and development machine are on the same network.
3. Run `npm start` and scan the QR code displayed in the terminal or Expo Dev Tools using Expo Go.
4. The app will load on your device with live reload enabled.
