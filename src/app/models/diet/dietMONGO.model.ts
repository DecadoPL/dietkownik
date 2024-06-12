import { DietDayMONGO } from "./dietDayMONGO.model";
import { DietRequirementsMONGO } from "./dietRequirementsMONGO.model";

export class DietMONGO{
  _id: string | undefined;
  dietName: string;
  dietDescription: string;
  dietRequirements: DietRequirementsMONGO;
  dietDays: DietDayMONGO[];
  dietInUse: boolean;

  
  constructor(
    _id: string | undefined,
    dietName: string,
    dietDescription: string,
    dietRequirements: DietRequirementsMONGO,
    dietDays: DietDayMONGO[],
    dietInUse: boolean
  ){
    this._id = _id;
    this.dietName = dietName;
    this.dietDescription = dietDescription;
    this.dietRequirements = dietRequirements;
    this.dietDays = dietDays;
    this.dietInUse = dietInUse;

  }
}