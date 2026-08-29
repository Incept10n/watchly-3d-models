import { Route, Routes } from "react-router";

import { DbSeederPage } from "./modules/dbSeeder";
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
      </Routes>
      <ModalHost />
    </>
  );
};
