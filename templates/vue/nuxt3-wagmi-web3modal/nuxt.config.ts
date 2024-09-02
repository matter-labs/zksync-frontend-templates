// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "zkSync + wagmi + Web3Modal + Nuxt 3"
    }
  },
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  appConfig: {
    walletConnectProjectID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
  imports: {
    dirs: ["store"],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['w3m-button'].includes(tag),
    },
  },
})
