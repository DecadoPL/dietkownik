import { DietDayMONGO } from "./dietDayMONGO.model";
import { DietRequirementsMONGO } from "./dietRequirementsMONGO.model";

export class DietMONGO{
  _id: string | undefined;
  dietName: string;
  dietDescription: string;
  dietRequirements: DietRequirementsMONGO;
  dietDays: DietDayMONGO[];

  
  constructor(
    _id: string | undefined,
    dietName: string,
    dietDescription: string,
    dietRequirements: DietRequirementsMONGO,
    dietDays: DietDayMONGO[]
  ){
    this._id = _id;
    this.dietName = dietName;
    this.dietDescription = dietDescription;
    this.dietRequirements = dietRequirements;
    this.dietDays = dietDays;

  }
}