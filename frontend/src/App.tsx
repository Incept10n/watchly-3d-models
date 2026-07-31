import { Route, Routes } from "react-router";

import { DbSeederPage } from "./modules/dbSeeder";
import { WatchConstructorPage } from "./modules/watchConstructor";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WatchConstructorPage />} />
      <Route path="/seeder" element={<DbSeederPage />} />
    </Routes>
  );
};
