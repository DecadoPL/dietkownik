import { DietDishMONGO } from "./dietDishMONGO.model";

export class DietDayMONGO{
  public _id: string | undefined;
  public dayName: string;
  public dayDate: string;
  public dayDishes: DietDishMONGO[];

  constructor(
    _id: string | undefined,
    dayName: string,
    dayDate: string,
    dayDishes: DietDishMONGO[]
  ){
    this._id = _id;
    this.dayName = dayName;
    this.dayDate = dayDate;
    this.dayDishes = dayDishes;
  }
}