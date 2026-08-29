interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_AVITO_URL: string;
  readonly VITE_VK_URL: string;
  readonly VITE_EMAIL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

