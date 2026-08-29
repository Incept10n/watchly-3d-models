import { RubiksCubeIcon } from "../../icons";
import { AdditionalActionButton } from "../AdditionalActionButton";

export const RandomizeModel = () => {
  const randomizeModel = () => {
    console.log("dummy randomizing model");
  };

  return (
    <AdditionalActionButton onClick={randomizeModel}>
      <div>Перемешать модель</div>
      <RubiksCubeIcon />
    </AdditionalActionButton>
  );
};
