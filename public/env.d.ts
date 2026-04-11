/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_COS_BUCKET?: string
  readonly VITE_COS_REGION?: string
  readonly VITE_APP_PREFIX: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
