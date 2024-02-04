
import { PortionMONGO } from "./portionMONGO.model";

export class IngredientMONGO{
  public _id: string | undefined;
  public ingrName: string;
  public ingrProteins: number;
  public ingrCarbohydrates: number;
  public ingrFat: number;
  public ingrKcal: number;
  public ingrPortions: PortionMONGO[];

  constructor(
    _id: string | undefined,
    ingrName: string,
    ingrProteins: number,
    ingrCarbohydrates: number,
    ingrFat: number,
    ingrKcal: number,
    ingrPortions: PortionMONGO[]
  ){

    this._id = _id;
    this.ingrName = ingrName;
    this.ingrProteins = ingrProteins;
    this.ingrCarbohydrates = ingrCarbohydrates;
    this.ingrFat = ingrFat;
    this.ingrKcal = ingrKcal;
    this.ingrPortions = ingrPortions;
  }

}