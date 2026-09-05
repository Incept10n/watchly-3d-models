import { Route, Routes } from "react-router";

import { DbSeederPage } from "./modules/dbSeeder";
import { PrivacyPolicyPage, PublicOfferPage } from "./modules/legal";
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
        <Route path="/public-offer" element={<PublicOfferPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
      <ModalHost />
    </>
  );
};

