import { Route, Routes } from "react-router";

import { DbSeederPage } from "./modules/dbSeeder";
import {
  ErrorBoundary,
  ErrorPage,
  useGlobalErrorRedirect,
} from "./modules/error";
import { PrivacyPolicyPage, PublicOfferPage } from "./modules/legal";
import { NotFoundPage } from "./modules/notFound";
import { OrdersClientPage } from "./modules/ordersClient";
import { WatchConstructorPage } from "./modules/watchConstructor";
import { ModalHost, ScrollToTop } from "./shared/ui";

export const App = () => {
  useGlobalErrorRedirect();

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<WatchConstructorPage />} />
        <Route path="/seeder" element={<DbSeederPage />} />
        <Route path="/orders" element={<OrdersClientPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/public-offer" element={<PublicOfferPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ModalHost />
    </ErrorBoundary>
  );
};

