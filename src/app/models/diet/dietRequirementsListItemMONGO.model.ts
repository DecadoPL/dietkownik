export class DietRequirementsListItemMONGO{
  public _id: string;
  public dietRequirementsName: string

  constructor(
    _id: string,
    dietRequirementsName: string
  ){
    this._id = _id;
    this.dietRequirementsName = dietRequirementsName;
  }
}