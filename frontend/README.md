deploy this as a simple vite frontend.

.env file example:

```
VITE_BASE_URL=http://localhost:3000/api

VITE_AVITO_URL=https://www.avito.ru/sankt-peterburg/predlozheniya_uslug/kastomnye_chasy_na_zakaz_8189036442
VITE_VK_URL=https://vk.ru/club240513824
VITE_EMAIL_URL=https://mail.yandex.ru/?to=Incept1on.hf@yandex.ru

VITE_PINTEREST_URL=https://ru.pinterest.com/WatchlyCustom/
VITE_YOUTUBE_URL=https://www.youtube.com/@watchly-custom
```

Legal documents (public offer and privacy policy) are hardcoded in
`src/data/legalDocs.ts` and rendered at `/public-offer` and `/privacy-policy`.
