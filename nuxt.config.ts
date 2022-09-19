import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    redisUrl: 'redis://localhost:6379/',
    session: {
      cookieName: 'ecnc-sso-session',
      expires: 7200,
    },
    wechat: {
      appId: '',
      appSecret: '',
    },
    lark: {
      appId: '',
      appSecret: '',
      welcomeLetterLink: '',
    },
    discourse: {
      secret: '',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@robinwongm/trpc-nuxt',
  ],
  trpc: {
    baseURL: '',
  },
  typescript: {
    strict: true,
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
          ]
        : ['@juggle/resize-observer'],
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
});
