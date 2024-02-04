export class DietDishMONGO{
  _id: string | undefined;
  dietDishQuantity: number;
  dietDishTime: string;
  dishId: string | undefined;
  dishName: string;
  dishPortions: number;
  dietDishProteins: number;
  dietDishCarbohydrates: number;
  dietDishFat: number;
  dietDishKcal: number;

  constructor( 
    _id: string | undefined,
    dietDishQuantity: number,
    dietDishTime: string,
    dishId: string | undefined,
    dishName: string,
    dishPortions: number,
    dietDishProteins: number,
    dietDishCarbohydrates: number,
    dietDishFat: number,
    dietDishKcal: number, 
  ){

    this._id = _id;
    this.dietDishQuantity = dietDishQuantity;
    this.dietDishTime = dietDishTime;
    this.dishId = dishId;
    this.dishName = dishName;
    this.dishPortions = dishPortions;
    this.dietDishProteins = dietDishProteins;
    this.dietDishCarbohydrates = dietDishCarbohydrates;
    this.dietDishFat = dietDishFat;
    this.dietDishKcal = dietDishKcal;

  }
}