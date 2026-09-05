import { Route, Routes } from "react-router";

import { privacyPolicy, publicOffer } from "@/data/legalDocs";
import { DbSeederPage } from "./modules/dbSeeder";
import { LegalPage } from "./modules/legal";
import { OrdersClientPage } from "./modules/ordersClient";
import { WatchConstructorPage } from "./modules/watchConstructor";
import { ModalHost } from "./shared/ui";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WatchConstructorPage />} />
        <Route path="/seeder" element={<DbSeederPage />} />
        <Route path="/orders" element={<OrdersClientPage />} />
        <Route
          path="/public-offer"
          element={<LegalPage title="Публичная оферта" content={publicOffer} />}
        />
        <Route
          path="/privacy-policy"
          element={
            <LegalPage
              title="Политика конфиденциальности"
              content={privacyPolicy}
            />
          }
        />
      </Routes>
      <ModalHost />
    </>
  );
};