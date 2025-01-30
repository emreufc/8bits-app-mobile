import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '8bits-app-mobile',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile','email'],
      serverClientId: '815547038198-6h5qau9npn8f8vqi039k7tfre24f0cfs.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      androidClientId: '815547038198-6h5qau9npn8f8vqi039k7tfre24f0cfs.apps.googleusercontent.com'
    }
  }
};

export default config;
