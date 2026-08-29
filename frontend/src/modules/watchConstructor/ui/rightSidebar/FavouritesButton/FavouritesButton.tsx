import { HeartIcon } from "../../icons";
import { AdditionalActionButton } from "../AdditionalActionButton";

export const FavouritesButton = () => {
  const handleAddFavourites = () => {
    console.log("dummy adding to favourites");
  };

  return (
    <AdditionalActionButton onClick={handleAddFavourites}>
      <div>Поместить в избранное</div>
      <HeartIcon />
    </AdditionalActionButton>
  );
};
