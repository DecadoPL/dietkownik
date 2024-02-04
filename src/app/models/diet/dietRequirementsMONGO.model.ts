export class DietRequirementsMONGO{
  public _id: string | undefined;
  public dietRequirementsName: string;
  public dietRequirementsProteins: number;
  public dietRequirementsCarbohydrates: number;
  public dietRequirementsFat: number;
  public dietRequirementsKcal: number;
  public dietRequirementsMealsTime: string[];

  constructor(
    _id: string | undefined,
    dietRequirementsName: string,
    dietRequirementsProteins: number,
    dietRequirementsCarbohydrates: number,
    dietRequirementsFat: number,
    dietRequirementsKcal: number,
    dietRequirementsMealsTime: string[],
  ){
    this._id = _id;
    this.dietRequirementsName = dietRequirementsName;
    this.dietRequirementsProteins = dietRequirementsProteins;
    this.dietRequirementsCarbohydrates = dietRequirementsCarbohydrates;
    this.dietRequirementsFat = dietRequirementsFat;
    this.dietRequirementsKcal = dietRequirementsKcal;
    this.dietRequirementsMealsTime = dietRequirementsMealsTime;
  }
}

