interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_AVITO_URL: string;
  readonly VITE_VK_URL: string;
  readonly VITE_EMAIL_URL: string;
  readonly VITE_PINTEREST_URL: string;
  readonly VITE_YOUTUBE_URL: string;
  readonly VITE_OFFERTA_URL: string;
  readonly VITE_PRIVACY_URL: string;
  readonly VITE_CONSENT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

