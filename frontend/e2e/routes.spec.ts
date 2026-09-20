import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

// Distinctive texts rendered by the app-wide ErrorBoundary (ErrorPage) and the
// NotFoundPage. Any real route showing them means something went wrong.
const ERROR_PAGE_TEXT = "Что-то пошло не так";
const NOT_FOUND_PAGE_TEXT = "К сожалению, такой страницы не существует";

// Binary/formatted resources that must come back as themselves, never as the
// SPA fallback index.html (which vite preview / nginx return for missing files).
const ASSET_URL_PATTERN = /\.(glb|wasm|png|jpe?g|gif|woff2?)$/i;

const APP_ORIGIN = "http://localhost:4173";

// Things not owned by the app shell: its own API (backend may be down) and the
// favicon (missing asset, cosmetic only). Cross-origin fonts etc. are ignored.
const isIgnoredUrl = (url: string) =>
  url.includes("/api/") ||
  url.endsWith("/favicon.svg") ||
  (url !== APP_ORIGIN && !url.startsWith(`${APP_ORIGIN}/`));

type CollectedError = { kind: string; detail: string };

const collectErrors = (page: Page): CollectedError[] => {
  const errors: CollectedError[] = [];

  const push = (kind: string, detail: string) => {
    errors.push({ kind, detail });
  };

  page.on("pageerror", (error) => push("pageerror", error.message));

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (isIgnoredUrl(text)) return;
    // Chrome's generic subresource failure report; the URL is separate and it
    // duplicates our response/requestfailed checks.
    if (text.startsWith("Failed to load resource")) return;
    push("console", text);
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (isIgnoredUrl(url)) return;
    if (request.failure()?.errorText === "net::ERR_ABORTED") return;
    push(
      "requestfailed",
      `${request.method()} ${url}: ${request.failure()?.errorText ?? "unknown"}`,
    );
  });

  page.on("response", (response) => {
    const url = response.url();
    if (isIgnoredUrl(url)) return;

    if (response.status() >= 400) {
      push(
        "bad-response",
        `${response.status()} ${response.request().method()} ${url}`,
      );
      return;
    }

    if (ASSET_URL_PATTERN.test(url)) {
      const contentType = response.headers()["content-type"] ?? "";
      if (contentType.includes("text/html")) {
        push("asset-as-html", `${url} returned text/html`);
      }
    }
  });

  return errors;
};

type RouteCase = {
  name: string;
  path: string;
  waitFor: string;
  expectsErrorPage?: boolean;
  expectsNotFound?: boolean;
};

const ROUTES: RouteCase[] = [
  { name: "watch constructor", path: "/", waitFor: "canvas" },
  { name: "db seeder", path: "/seeder", waitFor: "Parts" },
  { name: "orders", path: "/orders", waitFor: "Orders" },
  { name: "public offer", path: "/public-offer", waitFor: "Публичная оферта" },
  {
    name: "privacy policy",
    path: "/privacy-policy",
    waitFor: "Политика конфиденциальности",
  },
  {
    name: "error page (intentional)",
    path: "/error",
    waitFor: ERROR_PAGE_TEXT,
    expectsErrorPage: true,
  },
  {
    name: "unknown route (intentional 404)",
    path: "/this-page-does-not-exist",
    waitFor: NOT_FOUND_PAGE_TEXT,
    expectsNotFound: true,
  },
];

for (const route of ROUTES) {
  test(`/ opens: ${route.name}`, async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto(route.path);

    if (route.waitFor === "canvas") {
      await page.locator("canvas").waitFor({ timeout: 90_000 });
    } else {
      await expect(
        page.getByText(route.waitFor, { exact: false }).first(),
      ).toBeVisible();
    }

    // Let every async load finish (GLBs, Draco decode, fonts, API calls) so late
    // failures, not just render errors, are captured.
    await page
      .waitForLoadState("networkidle", { timeout: 90_000 })
      .catch(() => {});
    await page.waitForTimeout(1_500);

    if (!route.expectsErrorPage) {
      await expect(page.getByText(ERROR_PAGE_TEXT)).toHaveCount(0);
    }
    if (!route.expectsNotFound) {
      await expect(page.getByText(NOT_FOUND_PAGE_TEXT)).toHaveCount(0);
    }

    const summary = errors
      .map((error) => `  [${error.kind}] ${error.detail}`)
      .join("\n");
    expect(
      errors,
      `page "${route.path}" produced errors:\n${summary || "(none)"}`,
    ).toEqual([]);
  });
}

