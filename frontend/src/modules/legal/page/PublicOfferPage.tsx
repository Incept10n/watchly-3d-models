import type { FC } from "react";

import { LegalPage } from "../components";
import { PUBLIC_OFFER_CONTENT } from "../textData";

export const PublicOfferPage: FC = () => {
  return <LegalPage title="Публичная оферта" content={PUBLIC_OFFER_CONTENT} />;
};
