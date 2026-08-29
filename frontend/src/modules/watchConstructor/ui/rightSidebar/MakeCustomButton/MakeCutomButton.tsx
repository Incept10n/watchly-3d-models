import { MessageIcon } from "../../icons";
import { AdditionalActionButton } from "../AdditionalActionButton";

export const MakeCutomButton = () => {
  const handleMakeCustom = () => {
    console.log("dummy opening 'make custom watch' modal");
  };

  return (
    <AdditionalActionButton onClick={handleMakeCustom}>
      <div>Кастомизировать больше</div>
      <MessageIcon />
    </AdditionalActionButton>
  );
};
