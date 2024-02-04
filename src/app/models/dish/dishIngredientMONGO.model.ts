import { IngredientMONGO } from "../ingredient/ingredientMONGO.model";
import { PortionMONGO } from "../ingredient/portionMONGO.model";

export class DishIngredientMONGO{
  public _id: string | undefined;
  public dishIngrPortion: PortionMONGO;
  public dishIngrQuantity: number;
  public ingrId: string | undefined;
  public ingrName: string;
  public ingrProteins: number;
  public ingrCarbohydrates: number;
  public ingrFat: number;
  public ingrKcal: number;
  public ingrPortions: PortionMONGO[];

  constructor(
    _id: string | undefined,
    dishIngrPortion: PortionMONGO,
    dishIngrQuantity: number,
    ingrId: string,
    ingrName: string,
    ingrProteins: number,
    ingrCarbohydrates: number,
    ingrFat: number,
    ingrKcal: number,
    ingrPortions: PortionMONGO[]
  ){

    this._id = _id;
    this.dishIngrPortion = dishIngrPortion;
    this.dishIngrQuantity = dishIngrQuantity;
    this.ingrId = ingrId;
    this.ingrName = ingrName;
    this.ingrProteins = ingrProteins;
    this.ingrCarbohydrates = ingrCarbohydrates;
    this.ingrFat = ingrFat;
    this.ingrKcal = ingrKcal;
    this.ingrPortions = ingrPortions;
  }
}