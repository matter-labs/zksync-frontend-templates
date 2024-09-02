// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "zkSync + ethers + Nuxt 3"
    }
  },
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  
  imports: {
    dirs: ["store"],
  },
})
