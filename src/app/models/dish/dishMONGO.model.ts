import { DishIngredientMONGO } from "./dishIngredientMONGO.model";

export class DishMONGO{
  public _id: string | undefined;
  public dishName: string;
  public dishRecipe: string;
  public dishPortions: number;
  public dishProteinsPerPortion: number;
  public dishCarbohydratesPerPortion: number;
  public dishFatPerPortion: number;
  public dishKcalPerPortion: number;
  public dishIngredients: DishIngredientMONGO[];

  constructor(
    _id: string | undefined,
    dishName: string,
    dishRecipe: string,
    dishPortions: number,
    dishProteinsPerPortion: number,
    dishCarbohydratesPerPortion: number,
    dishFatPerPortion: number,
    dishKcalPerPortion: number,
    dishIngredients: DishIngredientMONGO[],
  
  ){
    this._id = _id;
    this.dishName = dishName;
    this.dishRecipe = dishRecipe;
    this.dishPortions = dishPortions;
    this.dishProteinsPerPortion = dishProteinsPerPortion;
    this.dishCarbohydratesPerPortion = dishCarbohydratesPerPortion;
    this.dishFatPerPortion = dishFatPerPortion;
    this.dishKcalPerPortion = dishKcalPerPortion;
    this.dishIngredients = dishIngredients;
  }
}
