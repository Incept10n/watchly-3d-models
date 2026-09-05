import type { FC } from "react";

import { LegalPage } from "../components";
import { PRIVACY_POLICY_CONTENT } from "../textData";

export const PrivacyPolicyPage: FC = () => {
  return (
    <LegalPage
      title="Политика конфиденциальности"
      content={PRIVACY_POLICY_CONTENT}
    />
  );
};
