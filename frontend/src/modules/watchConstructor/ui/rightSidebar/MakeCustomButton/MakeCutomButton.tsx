import { useModalStore } from "@/shared/store";

import { ContactUsModal } from "../../orderFlow";
import { MessageIcon } from "../../icons";
import { AdditionalActionButton } from "../AdditionalActionButton";

export const MakeCutomButton = () => {
  const pushModal = useModalStore((state) => state.pushModal);

  const handleMakeCustom = () => {
    pushModal({ id: "contact-us", content: <ContactUsModal /> });
  };

  return (
    <AdditionalActionButton onClick={handleMakeCustom}>
      <div>Связаться с нами</div>
      <MessageIcon />
    </AdditionalActionButton>
  );
};
